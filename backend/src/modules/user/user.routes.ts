import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getProfile,
  updateProfile,
  createSkill,
  getSkills,
  editSkill,
  removeSkill
} from "./user.controller";

const router = Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.post("/skills", createSkill);
router.get("/skills", getSkills);
router.put("/skills/:id", editSkill);
router.delete("/skills/:id", removeSkill);

export default router;
