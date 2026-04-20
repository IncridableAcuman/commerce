import z from "zod";

const registerSchema = z.object({
    firstname: z.string().min(3, "Firstname must be greater than 3 character long").max(50, "Firstname must be less than 50 characters long"),
    lastname: z.string().min(3, "Lastname must be greater than 3 character long").max(50, "Lastname must be less than 50 characters long"),
    username: z.string().min(3, "Username must be greater than 3 character long").max(50, "Username must be less than 50 characters long"),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().trim().min(8, "Password must be greater than 8 characters long").max(50, "Password must be less than 50 characters long")
});

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().trim().min(8, "Password must be greater than 8 characters long").max(50, "Password must be less than 50 characters long")
});

const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format") 
});

const resetPasswordSchema = z.object({
    password: z.string().trim().min(8, "Password must be greater than 8 characters long").max(50, "Password must be less than 50 characters long"),
    confirmPassword: z.string().trim().min(8, "ConfirmPassword must be greater than 8 characters long").max(50, "ConfirmPassword must be less than 50 characters long")
});

export  {registerSchema,loginSchema,forgotPasswordSchema,resetPasswordSchema};