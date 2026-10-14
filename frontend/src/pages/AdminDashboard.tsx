import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useAdminStore } from "../stores/adminStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AnalyticsOverview } from "../components/admin/AnalyticsOverview";
import { RoleManagement } from "../components/admin/RoleManagement";
import { ProductManagement } from "../components/admin/ProductManagement";
import { OrderManagement } from "../components/admin/OrderManagement";
import {
  BarChart3,
  Package,
  ShoppingBag,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Home as HomeIcon,
} from "lucide-react";

type DashboardTab = "overview" | "products" | "orders" | "roles";

export const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { analytics, analyticsLoading, fetchAnalytics } = useAdminStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab") as DashboardTab | null;
  const [activeTab, setActiveTab] = useState<DashboardTab>(tabParam || "overview");

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";
  const canAccessDashboard = isAdmin || isManager;

  useEffect(() => {
    if (tabParam && ["overview", "products", "orders", "roles"].includes(tabParam)) {
      if (tabParam === "roles" && !isAdmin) {
        setActiveTab("overview");
      } else {
        setActiveTab(tabParam);
      }
    }
  }, [tabParam, isAdmin]);

  useEffect(() => {
    if (canAccessDashboard) {
      fetchAnalytics();
    }
  }, [canAccessDashboard, fetchAnalytics]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // 1. Ruxsatsiz foydalanuvchilar uchun xavfsizlik ekrani
  if (!isAuthenticated || !canAccessDashboard) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md bg-slate-900/60 border border-slate-800 p-8 rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Kirish taqiqlangan</h3>
            <p className="text-xs text-slate-400">
              Ushbu boshqaruv paneliga faqat Administrator (ADMIN) yoki Menejer (MANAGER) roliga ega foydalanuvchilar kira oladi.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Bosh sahifaga qaytish</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 1. Dashboard Bosh sarlavhasi va foydalanuvchi roli */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                isAdmin
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
              }`}>
                {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {isAdmin ? "Administrator Paneli" : "Menejer Paneli"}
              </span>
              <span className="text-xs text-slate-500 font-medium">ShopLuxe Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Boshqaruv Paneli & Statistika
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Platforma ko'rsatkichlari, savdo dinamikasi, mahsulotlar va buyurtmalar markazi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAnalytics()}
              disabled={analyticsLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading ? "animate-spin" : ""}`} />
              <span>Statistikani yangilash</span>
            </button>
          </div>
        </div>

        {/* 2. Asosiy Tab Menyu (Tabs Navigation) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
          {/* Tab 1: Umumiy Statistika & Grafiklar */}
          <button
            onClick={() => handleTabChange("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistika & Grafiklar</span>
          </button>

          {/* Tab 2: Mahsulotlar boshqaruvi */}
          <button
            onClick={() => handleTabChange("products")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "products"
                ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Mahsulotlar ({analytics?.overview?.totalProducts ?? 0})</span>
          </button>

          {/* Tab 3: Buyurtmalar boshqaruvi */}
          <button
            onClick={() => handleTabChange("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buyurtmalar ({analytics?.overview?.totalOrders ?? 0})</span>
          </button>


          {/* Tab 4: Rollarni boshqarish (Faqat ADMIN uchun) */}
          {isAdmin && (
            <button
              onClick={() => handleTabChange("roles")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "roles"
                  ? "bg-linear-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/25"
                  : "bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Rollar boshqaruvi (ADMIN)</span>
            </button>
          )}
        </div>

        {/* 3. Tanlangan Tab Kontenti */}
        <div>
          {activeTab === "overview" && (
            <AnalyticsOverview
              data={analytics}
              loading={analyticsLoading}
              onRefresh={fetchAnalytics}
              onNavigateToProducts={() => handleTabChange("products")}
              onNavigateToOrders={() => handleTabChange("orders")}
            />
          )}

          {activeTab === "products" && <ProductManagement />}

          {activeTab === "orders" && <OrderManagement />}

          {activeTab === "roles" && isAdmin && <RoleManagement />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
