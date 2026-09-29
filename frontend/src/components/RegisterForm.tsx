import { AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { UseAuth } from "../contexts/AuthProvider";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterData } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterForm = ({
  isAuth,
  showPassword,
  setShowPassword,
}: {
  isAuth: boolean;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
}) => {
    const { userRegister, loading } = UseAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema)
    });

    const handleRegister = async (data: RegisterData) => {
        await userRegister(data);
    };

  return (
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
              <div className={`flex items-center gap-3 bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
                errors.fullName ? "border-red-500/80 focus-within:ring-red-500/20" : "border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
              } focus-within:ring-2`}>
                <UserRound className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="fullName"
                  {...register('fullName')}
                  placeholder="To'liq ismingiz"
                  className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-400 mt-1 pl-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Username input va xatolik */}
            <div className="space-y-1.5">
              <div className={`flex items-center gap-3 bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
                errors.username ? "border-red-500/80 focus-within:ring-red-500/20" : "border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
              } focus-within:ring-2`}>
                <UserRound className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="username"
                  {...register('username')}
                  placeholder="Foydalanuvchi nomi (username)"
                  className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-400 mt-1 pl-1">{errors.username.message}</p>
              )}
            </div>
          </motion.div>
      </AnimatePresence>

      {/* Email input va xatolik */}
      <div className="space-y-1.5">
        <div className={`flex items-center gap-3 bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
          errors.email ? "border-red-500/80 focus-within:ring-red-500/20" : "border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
        } focus-within:ring-2`}>
          <Mail className="w-5 h-5 text-slate-400" />
          <input
            type="email"
            id="email"
            {...register('email')}
            placeholder="name@example.com"
            className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400 mt-1 pl-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password input va xatolik */}
      <div className="space-y-1.5">
        <div className={`flex items-center gap-3 bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
          errors.password ? "border-red-500/80 focus-within:ring-red-500/20" : "border-slate-700/60 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
        } focus-within:ring-2`}>
          <Lock className="w-5 h-5 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="••••••••"
            {...register('password')}
            className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400 mt-1 pl-1">{errors.password.message}</p>
        )}
      </div>

      {isAuth && (
        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Parolni unutdingizmi?
          </a>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full mt-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer disabled:opacity-50"
      >
        <span>{loading ? "Yuklanmoqda..." : (isAuth ? "Kirish" : "Ro'yxatdan o'tish")}</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </form>
  );
};

export default RegisterForm;