import { Router } from "express";
import {
  register,
  login,
  getMe,
  logout,
  changePassword
} from "./auth.controller";

import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.put("/change-password", authenticate, changePassword);

export default router;
