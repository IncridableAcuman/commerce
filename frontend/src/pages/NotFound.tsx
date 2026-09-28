import { ShoppingBag, ShieldCheck, Truck, Headphones, Home, ArrowLeft, SearchX } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                Manzil topilmadi
              </h2>
              <p className="text-slate-200 text-sm lg:text-base leading-relaxed">
                Siz qidirayotgan sahifa ko'chirilgan, o'chirilgan yoki umuman mavjud bo'lmasligi mumkin. Keling, sizni kerakli manzilga yo'naltiramiz.
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

        {/* O'ng tomon: Asosiy xabar va tugmalar */}
        <div className="lg:col-span-7 bg-slate-900 p-8 lg:p-16 flex flex-col justify-center items-center text-center">
          <div className="max-w-md w-full mx-auto">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Katta 404 raqami va Ikonka */}
              <div className="relative flex items-center justify-center mb-6">
                <span className="text-8xl lg:text-9xl font-black text-slate-800/60 select-none tracking-widest">
                  404
                </span>
                <div className="absolute w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl">
                  <SearchX className="w-8 h-8" />
                </div>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">
                Sahifa topilmadi
              </h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Afsuski, bunday sahifa mavjud emas. Havolani xato kiritgan bo'lishingiz yoki sahifa eskirgan bo'lishi mumkin.
              </p>

              {/* Harakatga chaqiruvchi tugmalar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  href="/"
                  className="w-full sm:flex-1 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all duration-300"
                >
                  <Home className="w-4 h-4" />
                  <span>Bosh sahifa</span>
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.history.back()}
                  className="w-full sm:flex-1 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ortga qaytish</span>
                </motion.button>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;