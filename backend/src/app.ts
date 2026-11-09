import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import analyzerRoutes from "./modules/analyzer/analyzer.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

const app = express();

// CORS must run before API routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  })
);

// Global middleware
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSync API is running"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analyzer", analyzerRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
