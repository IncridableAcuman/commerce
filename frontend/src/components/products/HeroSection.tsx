import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Star,
  Sparkles,
  Flame
} from "lucide-react";

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      {/* Orqa fon nur effekti */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Yuqori mini-badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-medium shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>2026 Yangi Mahsulotlar To'plami</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </motion.div>

          {/* Asosiy Sarlavha */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Mukammal Sifat,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Betakror Uslub
            </span>
          </motion.h1>

          {/* Tavsif */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Zamonaviy elektronika, premium kiyim-kechak va zamonaviy aksessuarlar. Rasmiy kafolat va tezkor yetkazib berish xizmati bilan.
          </motion.p>

          {/* CTA Tugmalar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
          >
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-linear-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Xaridni boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#categories-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
            >
              <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span>Ommabop mahsulotlar</span>
            </a>
          </motion.div>
        </div>

        {/* 4 ta afzallik kartalari (Trust Badges) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/60"
        >
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5 backdrop-blur-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Tezkor yetkazish</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Butun O'zbekiston bo'ylab</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5 backdrop-blur-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">100% Asl mahsulot</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rasmiy kafolat bilan</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5 backdrop-blur-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Qulay to'lov</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Payme, Click, Naqd</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5 backdrop-blur-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-500 dark:text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">4.9 / 5 Reyting</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">25,000+ mijoz sharhlari</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
