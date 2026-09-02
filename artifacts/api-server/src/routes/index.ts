import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import vastuRouter from "./vastu";
import { requireApiKey } from "../middlewares/apiKey";

const router: IRouter = Router();

router.use(requireApiKey);
router.use(healthRouter);
router.use(aiRouter);
router.use(vastuRouter);

export default router;
