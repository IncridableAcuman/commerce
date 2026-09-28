import { Eye, EyeOff, Lock, Mail, UserRound, ShoppingBag, ArrowRight, ShieldCheck, Truck, Headphones } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [isAuth, setIsAuth] = useState(true); // true = Sign In, false = Sign Up
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden font-sans">
      <div className="w-full h-full bg-slate-900 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Chap tomon: E-commerce Banner */}
        <div className="lg:col-span-5 relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 lg:p-16 flex flex-col justify-between text-white overflow-hidden">
          {/* Orqa fondagi dekorativ elementlar */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo / Brend */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">ShopLuxe</span>
          </div>

          {/* Markaziy matnlar */}
          <div className="relative z-10 my-auto py-10">
            <motion.div
              key={isAuth ? "signin-banner" : "signup-banner"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                {isAuth ? "Xush kelibsiz! Qaytganingizdan xursandmiz." : "Bizning oilamizga qo'shiling!"}
              </h2>
              <p className="text-slate-200 text-sm lg:text-base leading-relaxed">
                {isAuth
                  ? "Sevimli mahsulotlaringizni kuzatib boring, eksklyuziv chegirmalar va tezkor buyurtma berish imkoniyatidan foydalaning."
                  : "Ro'yxatdan o'ting va maxsus bonuslar, sovg'alar hamda shaxsiy tavsiyalarga ega bo'ling."}
              </p>
            </motion.div>
          </div>

          {/* Pastki qismdagi ishonch belgilar */}
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
            
            {/* Sarlavha */}
            <div className="mb-8">
              <motion.h1 
                key={isAuth ? "title-in" : "title-up"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl lg:text-3xl font-bold text-white tracking-tight"
              >
                {isAuth ? "Hisobga kirish" : "Yangi hisob yaratish"}
              </motion.h1>
              <p className="text-slate-400 text-sm mt-1">
                {isAuth ? "Ma'lumotlaringizni kiriting va xaridlarni davom eting" : "Bir necha soniya ichida ro'yxatdan o'ting"}
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isAuth && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/60 px-4 py-3.5 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                      <UserRound className="w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="To'liq ismingiz"
                        className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/60 px-4 py-3.5 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                      <UserRound className="w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Foydalanuvchi nomi (username)"
                        className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/60 px-4 py-3.5 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <Mail className="w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/60 px-4 py-3.5 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isAuth && (
                <div className="flex justify-end">
                  <a href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Parolni unutdingizmi?
                  </a>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer"
              >
                <span>{isAuth ? "Kirish" : "Ro'yxatdan o'tish"}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>

            {/* Pastki o'tish tugmasi */}
            <div className="mt-8 text-center">
              {isAuth ? (
                <p className="text-sm text-slate-400">
                  Hisobingiz yo'qmi?{" "}
                  <button
                    onClick={() => setIsAuth(false)}
                    className="text-indigo-400 font-semibold hover:underline cursor-pointer"
                  >
                    Ro'yxatdan o'tish
                  </button>
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Hisobingiz bormi?{" "}
                  <button
                    onClick={() => setIsAuth(true)}
                    className="text-indigo-400 font-semibold hover:underline cursor-pointer"
                  >
                    Kirish
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;