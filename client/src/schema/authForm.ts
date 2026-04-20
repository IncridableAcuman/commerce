import type z from "zod";
import type { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.schema";

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ForgotForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

