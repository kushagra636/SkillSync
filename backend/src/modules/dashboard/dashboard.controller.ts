import { Request, Response, NextFunction } from "express";
import { getDashboardData } from "./dashboard.service";

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;

    const dashboard = await getDashboardData(userId);

    res.status(200).json({
      success: true,
      dashboard
    });
  } catch (error) {
    next(error);
  }
};
