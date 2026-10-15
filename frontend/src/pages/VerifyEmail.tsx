import React, { useState, useEffect } from "react";
import { Mail, ArrowRight, ShieldCheck, RefreshCw, ShoppingBag, Truck, Headphones, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import ThemeToggle from "../components/ThemeToggle";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendOtp, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return;

    const success = await verifyEmail({ email, otp: otp.trim() });
    if (success) {
      navigate("/");
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    const success = await resendOtp({ email });
    if (success) {
      setTimer(60);
      setCanResend(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden font-sans">
      <div className="w-full h-full bg-white dark:bg-slate-900 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
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
                Hisobingizni tasdiqlang!
              </h2>
              <p className="text-slate-200 text-sm lg:text-base leading-relaxed">
                Xavfsizlik maqsadida emailingizga 6 xonali tasdiqlash kodi (OTP) yubordik. Kodni kiriting va to'liq imkoniyatlardan foydalaning.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-slate-200">
            <div className="flex flex-col gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>Xavfsiz hisob</span>
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
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 lg:p-16 flex flex-col justify-center relative">
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kirish sahifasiga qaytish</span>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                <Mail className="w-6 h-6" />
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                Emailni tasdiqlash
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                {email ? (
                  <>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">{email}</span> manziliga tasdiqlash kodi yuborildi.
                  </>
                ) : (
                  "Pochtaga yuborilgan tasdiqlash kodini kiriting"
                )}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email input (agar query paramda bo'lmasa yoki o'zgartirmoqchi bo'lsa) */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 dark:text-slate-400 pl-1">Elektron pochta</label>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 px-4 py-3.5 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="bg-transparent outline-none w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    />
                  </div>
                </div>

                {/* OTP code input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 dark:text-slate-400 pl-1">6 xonali tasdiqlash kodi (OTP)</label>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 px-4 py-3.5 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Masalan: 123456"
                      required
                      className="bg-transparent outline-none w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-center tracking-widest text-lg font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Resend OTP button */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600 dark:text-slate-400">Kodni olmadingizmi?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Kodni qayta yuborish</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">
                      Qayta yuborish ({timer}s)
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || otp.length < 4}
                  className="w-full mt-4 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? "Tasdiqlanmoqda..." : "Tasdiqlash"}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;