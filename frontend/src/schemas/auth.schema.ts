import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z.string(),
    username: z.string(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required").min(8, "Password must be greater 8 character long")
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required").min(8, "Password must be greater 8 character long")
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
});
export const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(1, "Password is required").min(8, "Password must be greater 8 character long"),
    confirmPassword: z.string().min(1, "Confirm password is required").min(8, "Confirm password must be greater 8 character long")

})
export const resendOptCodeSchema = z.object({
    email: z.string().email("Invalid email format"),
});
export const verifyEmailSchema = z.object({
    email: z.string().email("Invalid email format"),
    otp: z.string()
});



export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ResendOtpCodeData = z.infer<typeof resendOptCodeSchema>;
export type VerifyEmailData = z.infer<typeof verifyEmailSchema>;