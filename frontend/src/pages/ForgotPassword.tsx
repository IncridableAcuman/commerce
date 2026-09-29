import { Mail, ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2, ShoppingBag, ShieldCheck, Truck, Headphones } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { UseAuth } from "../contexts/AuthProvider";
import { useForm } from "react-hook-form";
import type { ForgotPasswordData } from "../schemas/auth.schema";
import { forgotPasswordSchema } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const ForgotPassword = () => {
  const { forgotPassword, loading } = UseAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const handleForgotPassword = async (data: ForgotPasswordData) => {
    try {
      await forgotPassword(data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden font-sans">
      <div className="w-full h-full bg-slate-900 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Chap tomon: E-commerce Banner */}
        <div className="lg:col-span-5 relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 lg:p-16 flex flex-col justify-between text-white overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">ShopLuxe</span>
          </div>

          <div className="relative z-10 my-auto py-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                Xavfsizlik va Ishonch
              </h2>
              <p className="text-slate-200 text-sm lg:text-base leading-relaxed">
                Hisobingiz xavfsizligi biz uchun muhim. Parolingizni tiklang va xaridlaringizni davom ettiring.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-slate-200">
            <div className="flex flex-col gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>Xavfsiz to'lov</span>
            </div>
            <div className="flex flex-col gap-1">
              <Truck className="w-5 h-5 text-sky-300" />
              <span>Tezkor yetkazish</span>
            </div>
            <div className="flex flex-col gap-1">
              <Headphones className="w-5 h-5 text-amber-300" />
              <span>24/7 Yordam</span>
            </div>
          </div>
        </div>

        {/* O'ng tomon: Forma qismi */}
        <div className="lg:col-span-7 bg-slate-900 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-6">
              <a
                href="/auth"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kirish sahifasiga qaytish</span>
              </a>
            </div>

            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">
                  Parolni unutdingizmi?
                </h1>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Xavotir olmang! Ro'yxatdan o'tgan elektron pochtangizni kiriting va biz sizga parolni tiklash bo'yicha ko'rsatmalarni yuboramiz.
                </p>

                <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
                  <div className="space-y-1.5">
                    <div className={`flex items-center gap-3 bg-slate-800/50 border px-4 py-3.5 rounded-2xl transition-all ${
                      errors.email ? "border-red-500/80 focus-within:ring-red-500/20" : "border-slate-700/65 focus-within:border-indigo-500 focus-within:ring-indigo-500/20"
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

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? "Yuborilmoqda..." : "Tiklash havolasini yuborish"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Xat yuborildi!
                </h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Biz <span className="text-white font-medium">{submittedEmail}</span> manzilingizga parolni tiklash uchun maxsus havola yubordik. Iltimos, pochtangizni tekshiring.
                </p>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                >
                  Boshqa manzilni kiritish yoki qayta yuborish
                </button>
              </motion.div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;