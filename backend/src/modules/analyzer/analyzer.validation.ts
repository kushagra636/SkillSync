import { z } from "zod";

export const analyzeJobSchema = z.object({
  jobDescription: z.string()
    .trim()
    .min(50, "Job description must contain at least 50 characters")
    .max(10000, "Job description is too long")
});

export type AnalyzeJobInput = z.infer<typeof analyzeJobSchema>;
