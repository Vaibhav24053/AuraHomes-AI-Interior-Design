import type { RequestHandler } from "express";

const apiKeyHeader = "x-api-key";

export const requireApiKey: RequestHandler = (req, res, next) => {
  const configuredKey = process.env["AURAHOMES_API_KEY"];

  if (!configuredKey) {
    res.status(503).json({
      error: "API key authentication is not configured.",
      code: "AUTH_NOT_CONFIGURED",
    });
    return;
  }

  const providedKey = req.header(apiKeyHeader);
  if (!providedKey || providedKey !== configuredKey) {
    res.status(401).json({
      error: "A valid x-api-key header is required.",
      code: "UNAUTHORIZED",
    });
    return;
  }

  next();
};