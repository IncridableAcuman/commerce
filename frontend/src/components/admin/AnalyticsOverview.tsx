import { useMemo } from "react";
import type { DashboardAnalyticsResponse } from "../../interfaces/analytics.interface";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Sparkles,
} from "lucide-react";

interface AnalyticsOverviewProps {
  data: DashboardAnalyticsResponse | null;
  loading: boolean;
  onRefresh: () => void;
  onNavigateToProducts?: () => void;
  onNavigateToOrders?: () => void;
}

export const AnalyticsOverview = ({
  data,
  loading,
  onNavigateToProducts,
  onNavigateToOrders,
}: AnalyticsOverviewProps) => {
  const overview = data?.overview;
  const dailySales = data?.dailySales || [];
  const ordersByStatus = data?.ordersByStatus || {};
  const usersByRole = data?.usersByRole || { USER: 0, MANAGER: 0, ADMIN: 0 };
  const topProducts = data?.topProducts || [];
  const lowStockProducts = data?.lowStockProducts || [];

  // Kunlik sotuvlar grafigi uchun maksimal daromadni topish (SVG chart skalasi uchun)
  const maxDailyRevenue = useMemo(() => {
    if (dailySales.length === 0) return 100;
    const max = Math.max(...dailySales.map((s) => s.revenue));
    return max > 0 ? max * 1.15 : 100;
  }, [dailySales]);

  // Jami status buyurtmalari yig'indisi
  const totalStatusOrders = useMemo(() => {
    return Object.values(ordersByStatus).reduce((acc, curr) => acc + curr, 0) || 1;
  }, [ordersByStatus]);


  if (loading && !data) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Statistikalar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Asosiy KPI Kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Jami Daromad */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Jami Daromad</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            ${overview?.totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Bugun: +${overview?.todayRevenue?.toFixed(2) ?? "0.00"}</span>
          </div>
        </div>

        {/* Jami Buyurtmalar */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Jami Buyurtmalar</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {overview?.totalOrders ?? 0}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Bugun: {overview?.todayOrders ?? 0} ta yangi buyurtma</span>
          </div>
        </div>

        {/* Jami Mahsulotlar */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Mahsulotlar Soni</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {overview?.totalProducts ?? 0}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            {overview?.lowStockCount ? (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {overview.lowStockCount} ta kam qolgan
              </span>
            ) : (
              <span className="text-slate-400">Zaxira to'liq</span>
            )}
          </div>
        </div>

        {/* Jami Foydalanuvchilar */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Foydalanuvchilar</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {overview?.totalUsers ?? 0}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-purple-400 font-semibold">{usersByRole.ADMIN ?? 0}</span> admin,{" "}
            <span className="text-indigo-400 font-semibold">{usersByRole.MANAGER ?? 0}</span> manager
          </div>
        </div>
      </div>

      {/* 2. Grafiklar & Diagrammalar qatori */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* So'nggi 7 kunlik savdo dinamikasi (Interaktiv Bar / Trend Chart) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                So'nggi 7 kunlik daromad dinamikasi
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kunlar kesimida tushum va qabul qilingan buyurtmalar soni
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Oxirgi 7 kun jami:</span>
              <span className="text-sm font-extrabold text-emerald-400">
                ${dailySales.reduce((a, b) => a + b.revenue, 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* SVG Responsive Bar & Area Visualization */}
          <div className="h-64 flex flex-col justify-end pt-4 pb-2">
            <div className="flex-1 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {dailySales.map((stat, idx) => {
                const heightPercent = maxDailyRevenue > 0
                  ? Math.max(8, Math.min(100, (stat.revenue / maxDailyRevenue) * 100))
                  : 8;
                const formattedDate = new Date(stat.date).toLocaleDateString("uz-UZ", {
                  weekday: "short",
                  day: "numeric",
                });

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-slate-950 border border-slate-700 px-2.5 py-1.5 rounded-lg shadow-xl text-center pointer-events-none whitespace-nowrap">
                      <p className="text-[10px] text-slate-400">{stat.date}</p>
                      <p className="text-xs font-bold text-emerald-400">${stat.revenue.toFixed(2)}</p>
                      <p className="text-[10px] text-indigo-300">{stat.ordersCount} ta buyurtma</p>
                    </div>

                    {/* Value label */}
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                      ${stat.revenue > 999 ? `${(stat.revenue / 1000).toFixed(1)}k` : stat.revenue.toFixed(0)}
                    </span>

                    {/* Bar */}
                    <div className="w-full bg-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-end h-40">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-linear-to-t from-indigo-600 via-indigo-500 to-emerald-400 rounded-t-xl group-hover:brightness-125 transition-all duration-500 relative"
                      >
                        {stat.ordersCount > 0 && (
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/80" />
                        )}
                      </div>
                    </div>

                    {/* Day label */}
                    <span className="text-[11px] text-slate-400 font-medium group-hover:text-indigo-400 transition-colors">
                      {formattedDate}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buyurtmalar statuslari taqsimoti */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              Buyurtmalar taqsimoti
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Joriy statuslar bo'yicha statistik taqsimot
            </p>
          </div>

          {/* Progress barlar */}
          <div className="space-y-3.5 my-auto">
            {[
              { key: "PENDING", label: "Kutilmoqda", color: "bg-amber-400" },
              { key: "CONFIRMED", label: "Tasdiqlangan", color: "bg-blue-400" },
              { key: "PROCESSING", label: "Tayyorlanmoqda", color: "bg-indigo-400" },
              { key: "SHIPPED", label: "Yo'lda", color: "bg-cyan-400" },
              { key: "DELIVERED", label: "Yetkazildi", color: "bg-emerald-400" },
              { key: "CANCELLED", label: "Bekor qilingan", color: "bg-rose-400" },
            ].map(({ key, label, color }) => {

              const count = ordersByStatus[key] || 0;
              const percent = Math.round((count / totalStatusOrders) * 100);
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{label}</span>
                    <span className="font-bold text-slate-100">
                      {count} <span className="text-slate-500 text-[10px]">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {onNavigateToOrders && (
            <button
              onClick={onNavigateToOrders}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Barcha buyurtmalarni boshqarish →
            </button>
          )}
        </div>
      </div>

      {/* 3. Foydalanuvchilar Rollari, Zaxirasi kam mahsulotlar va Top sotuvlar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rollar taqsimoti (ADMIN, MANAGER, USER) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Foydalanuvchilar va Rollar
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
              Jami: {overview?.totalUsers ?? 0}
            </span>
          </div>

          <div className="space-y-3">
            {/* ADMIN */}
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Administratorlar (ADMIN)</p>
                  <p className="text-[11px] text-slate-400">To'liq boshqaruv va rol berish</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-red-400">
                {usersByRole.ADMIN ?? 0}
              </span>
            </div>

            {/* MANAGER */}
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Menejerlar (MANAGER)</p>
                  <p className="text-[11px] text-slate-400">Mahsulot va buyurtmalar nazorati</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-indigo-400">
                {usersByRole.MANAGER ?? 0}
              </span>
            </div>

            {/* USER */}
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Xaridorlar (USER)</p>
                  <p className="text-[11px] text-slate-400">Mahsulotlarni ko'rish va xarid</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-emerald-400">
                {usersByRole.USER ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Zaxirasi kam qolgan mahsulotlar (Low stock alerts) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Zaxira ogohlantirishlari
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {lowStockProducts.length} ta
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Omborda 5 tadan kam qolgan yoki tugagan mahsulotlar
            </p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Zaxirasi kam qolgan mahsulotlar yo'q
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-9 h-9 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.title}</p>
                      <p className="text-[10px] text-slate-400">${p.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                      p.stock === 0
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {p.stock === 0 ? "Tugagan" : `${p.stock} ta`}
                  </span>
                </div>
              ))
            )}
          </div>

          {onNavigateToProducts && (
            <button
              onClick={onNavigateToProducts}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Mahsulotlar zaxirasini to'ldirish →
            </button>
          )}
        </div>

        {/* Eng ko'p sotilgan mahsulotlar (Top Selling) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Eng ko'p sotilgan mahsulotlar
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Xaridlar soni bo'yicha yetakchi tovarlar
            </p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Hozircha sotuvlar mavjud emas
              </p>
            ) : (
              topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-center text-xs font-bold text-slate-500">
                      #{idx + 1}
                    </span>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-9 h-9 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.title}</p>
                      <p className="text-[10px] text-emerald-400 font-medium">
                        ${p.totalRevenue.toFixed(2)} tushum
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-800">
                    {p.totalSold} dona
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
