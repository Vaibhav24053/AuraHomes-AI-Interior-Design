import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { z } from "zod";
import router from "./routes";
import { PublicApiError } from "./lib/errors";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use((error: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const parserError = error as {
    status?: number;
    type?: string;
  };
  if (parserError?.type === "entity.too.large" || parserError?.status === 413) {
    res.status(413).json({
      error: "Request body is too large.",
      code: "PAYLOAD_TOO_LARGE",
    });
    return;
  }
  if (
    parserError?.type === "entity.parse.failed" ||
    (error instanceof SyntaxError && parserError?.status === 400)
  ) {
    res.status(400).json({
      error: "Request body contains invalid JSON.",
      code: "INVALID_JSON",
    });
    return;
  }

  if (error instanceof z.ZodError) {
    res.status(400).json({
      error: "Request validation failed.",
      code: "INVALID_REQUEST",
      issues: error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof PublicApiError) {
    logger.warn({ err: error, method: req.method, url: req.url }, "API request rejected");
    res.status(error.statusCode).json({
      error: error.publicMessage,
      code: error.code,
    });
    return;
  }

  logger.error({ err: error, method: req.method, url: req.url }, "API request failed");
  res.status(502).json({
    error: "The request could not be completed.",
    code: "UPSTREAM_REQUEST_FAILED",
  });
});

export default app;
