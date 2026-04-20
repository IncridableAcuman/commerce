import z from "zod";

const LoginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().trim().min(8, "Password must be greater than 8 characters long").max(50, "Password must be less than 50 characters long")
});

export default LoginSchema