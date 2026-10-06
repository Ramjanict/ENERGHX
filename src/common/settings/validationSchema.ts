import { z } from "zod";

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(4, { message: "Password must be at least 4 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
