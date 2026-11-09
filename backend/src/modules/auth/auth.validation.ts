import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(50),
  email: z.string().trim().email("Invalid email address").transform(value => value.toLowerCase()),
  password: z.string().min(8, "Password must contain at least 8 characters").max(72, "Password is too long")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").transform(value => value.toLowerCase()),
  password: z.string().min(1, "Password is required").max(72, "Invalid credentials")
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(72),
  newPassword: z.string().min(8, "New password must contain at least 8 characters").max(72, "New password is too long")
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;