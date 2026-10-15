import { AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterData } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({
  showPassword,
  setShowPassword,
}: {
  isAuth?: boolean;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
}) => {
  const { register: registerUser, isLoading, redirectToGoogleOAuth } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterData) => {
    const res = await registerUser(data);
    if (res.success) {
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {/* FullName input va xatolik */}
            <div className="space-y-1.5">
              <div
                className={`flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
                  errors.fullName
                    ? "border-red-500/80 focus-within:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
                } focus-within:ring-2`}
              >
                <UserRound className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="fullName"
                  {...register("fullName")}
                  placeholder="To'liq ismingiz"
                  className="bg-transparent outline-none w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 pl-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Username input va xatolik */}
            <div className="space-y-1.5">
              <div
                className={`flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
                  errors.username
                    ? "border-red-500/80 focus-within:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
                } focus-within:ring-2`}
              >
                <UserRound className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  placeholder="Foydalanuvchi nomi (username)"
                  className="bg-transparent outline-none w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 pl-1">{errors.username.message}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Email input va xatolik */}
        <div className="space-y-1.5">
          <div
            className={`flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
              errors.email
                ? "border-red-500/80 focus-within:ring-red-500/20"
                : "border-slate-200 dark:border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
            } focus-within:ring-2`}
          >
            <Mail className="w-5 h-5 text-slate-400" />
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="name@example.com"
              className="bg-transparent outline-none w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1 pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password input va xatolik */}
        <div className="space-y-1.5">
          <div
            className={`flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
              errors.password
                ? "border-red-500/80 focus-within:ring-red-500/20"
                : "border-slate-200 dark:border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
            } focus-within:ring-2`}
          >
            <Lock className="w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              {...register("password")}
              className="bg-transparent outline-none w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1 pl-1">{errors.password.message}</p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer disabled:opacity-50"
        >
          <span>{isLoading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </form>

      {/* Ajratuvchi chiziq */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider absolute">
          yoki
        </span>
      </div>

      {/* Google OAuth bilan ro'yxatdan o'tish tugmasi */}
      <button
        type="button"
        onClick={redirectToGoogleOAuth}
        className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-xs"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="text-sm">Google orqali ro'yxatdan o'tish</span>
      </button>
    </div>
  );
};

export default RegisterForm;