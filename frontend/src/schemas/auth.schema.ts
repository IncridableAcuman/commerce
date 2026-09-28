import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z.string().min(1, "To'liq ism kiritilishi shart").min(3, "To'liq ism kamida 3 ta belgidan iborat bo'lishi kerak").max(50, "To'liq ism 50 ta belgidan oshmasligi kerak"),
    username: z.string().min(1, "Foydalanuvchi nomi kiritilishi shart").min(3, "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak").max(50, "Foydalanuvchi nomi 50 ta belgidan oshmasligi kerak"),
    email: z.string().min(1, "Elektron pochta kiritilishi shart").email("Noto'g'ri elektron pochta formati"),
    password: z.string().min(1, "Parol kiritilishi shart").min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak").max(50, "Parol 50 ta belgidan oshmasligi kerak")
});

export const loginSchema = z.object({
    email: z.string().min(1, "Elektron pochta kiritilishi shart").email("Noto'g'ri elektron pochta formati"),
    password: z.string().min(1, "Parol kiritilishi shart").min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak").max(50, "Parol 50 ta belgidan oshmasligi kerak")
});

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Elektron pochta kiritilishi shart").email("Noto'g'ri elektron pochta formati"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token kiritilishi shart"),
    password: z.string().min(1, "Yangi parol kiritilishi shart").min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak").max(50, "Parol 50 ta belgidan oshmasligi kerak"),
    confirmPassword: z.string().min(1, "Parolni tasdiqlash kiritilishi shart").min(8, "Tasdiqlash paroli kamida 8 ta belgidan iborat bo'lishi kerak").max(50, "Tasdiqlash paroli 50 ta belgidan oshmasligi kerak")
}).refine((data) => data.password === data.confirmPassword, {
    message: " Parollar mos kelmadi",
    path: ["confirmPassword"],
});

export const resendOptCodeSchema = z.object({
    email: z.string().min(1, "Elektron pochta kiritilishi shart").email("Noto'g'ri elektron pochta formati"),
});

export const verifyEmailSchema = z.object({
    email: z.string().min(1, "Elektron pochta kiritilishi shart").email("Noto'g'ri elektron pochta formati"),
    otp: z.string().min(1, "Tasdiqlash kodi (OTP) kiritilishi shart")
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ResendOtpCodeData = z.infer<typeof resendOptCodeSchema>;
export type VerifyEmailData = z.infer<typeof verifyEmailSchema>;