import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  analyzeJob,
  getHistory,
  getHistoryById
} from "./analyzer.controller";

const router = Router();

router.use(authenticate);

router.post("/analyze", analyzeJob);
router.get("/history", getHistory);
router.get("/history/:id", getHistoryById);

export default router;