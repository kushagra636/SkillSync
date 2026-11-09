import { Request, Response, NextFunction } from "express";
import {
  analyzeJobDescription,
  getAnalysisHistory,
  getAnalysisById
} from "./analyzer.service";
import { analyzeJobSchema } from "./analyzer.validation";

export const analyzeJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = analyzeJobSchema.parse(req.body);
    const userId = res.locals.userId as string;

    const analysis = await analyzeJobDescription(
      userId,
      validatedData.jobDescription
    );

    res.status(201).json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;

    const history = await getAnalysisHistory(userId);

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};

export const getHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const analysisId = req.params.id;

    if (typeof analysisId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid analysis ID"
      });
      return;
    }

    const analysis = await getAnalysisById(userId, analysisId);

    if (!analysis) {
      res.status(404).json({
        success: false,
        message: "Analysis not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};