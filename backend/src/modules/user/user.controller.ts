import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  updateProfileSchema,
  addSkillSchema,
  updateSkillSchema
} from "./user.validation";

import {
  getUserProfile,
  updateUserProfile,
  addUserSkill,
  getUserSkills,
  updateUserSkill,
  deleteUserSkill
} from "./user.service";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await getUserProfile(res.locals.userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues
      });
    }

    const profile = await updateUserProfile(
      res.locals.userId,
      result.data
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const result = addSkillSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues
      });
    }

    const skill = await addUserSkill(res.locals.userId, result.data);

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      skill
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "You have already added this skill"
      });
    }

    console.error("Add skill error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add skill"
    });
  }
};

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await getUserSkills(res.locals.userId);

    return res.status(200).json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error("Get skills error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch skills"
    });
  }
};

export const editSkill = async (req: Request, res: Response) => {
  try {
    const result = updateSkillSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues
      });
    }

    const skillId = req.params.id;

    if (typeof skillId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID"
      });
    }

    const skill = await updateUserSkill(
      res.locals.userId,
      skillId,
      result.data
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill
    });
  } catch (error) {
    console.error("Update skill error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update skill"
    });
  }
};

export const removeSkill = async (req: Request, res: Response) => {
  try {
    const skillId = req.params.id;

    if (typeof skillId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID"
      });
    }

    const deleted = await deleteUserSkill(
      res.locals.userId,
      skillId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully"
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete skill"
    });
  }
};
