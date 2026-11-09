import { z } from "zod";

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  education: z.string().max(150).optional(),
  experience: z.number().int().min(0).max(60).optional(),
  githubUrl: z.string().url().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional()
}).refine(
  data => Object.keys(data).length > 0,
  "At least one profile field is required"
);

export const addSkillSchema = z.object({
  skillName: z.string().trim().min(1).max(50),
  proficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
});

export const updateSkillSchema = z.object({
  skillName: z.string().trim().min(1).max(50).optional(),
  proficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional()
}).refine(
  data => Object.keys(data).length > 0,
  "At least one skill field is required"
);

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddSkillInput = z.infer<typeof addSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
