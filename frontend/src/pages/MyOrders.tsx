import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  Eye,
  Ban,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
} from "lucide-react";
import { useOrderStore } from "../stores/orderStore";
import { useAuthStore } from "../stores/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { OrderStatusBadge } from "../components/orders/OrderStatusBadge";
import { OrderDetailModal } from "../components/orders/OrderDetailModal";
import type { Order } from "../interfaces/order.interface";
import { toast } from "react-toastify";

export const MyOrders = () => {
  const { orders, loading, fetchMyOrders, cancelOrder } = useOrderStore();
  const { isAuthenticated } = useAuthStore();

  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
    }
  }, [isAuthenticated, fetchMyOrders]);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleQuickCancel = async (orderId: number) => {
    if (
      !window.confirm(
        "Rostdan ham ushbu buyurtmani bekor qilmoqchimisiz? Mahsulotlar qayta sotuvga chiqariladi."
      )
    ) {
      return;
    }

    try {
      await cancelOrder(orderId);
      toast.info("Buyurtma bekor qilindi");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      toast.error(msg);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "ALL"
        ? true
        : selectedStatus === "ACTIVE"
        ? ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(order.status)
        : order.status === selectedStatus;

    const matchesSearch =
      search.trim() === "" ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.items?.some((i) =>
        i.productTitle.toLowerCase().includes(search.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Buyurtmalarni ko'rish uchun tizimga kiring
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Buyurtmalaringiz holati, yetkazib berish tarixi va kvitansiyalarni kuzatish uchun profilingizga kiring.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              Kirish
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>Mening buyurtmalarim</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {orders.length} ta
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Barcha buyurtmalaringiz va ularning yetkazilish holati
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchMyOrders()}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer shadow-xs"
              title="Yangilash"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Yangi xarid</span>
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "ALL", label: "Barchasi" },
              { id: "ACTIVE", label: "Faol" },
              { id: "PENDING", label: "Kutilmoqda" },
              { id: "DELIVERED", label: "Yetkazildi" },
              { id: "CANCELLED", label: "Bekor qilingan" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedStatus === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Raqam yoki mahsulot nomi..."
              className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Orders List */}
        {loading && orders.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-36 rounded-3xl bg-slate-200 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Buyurtmalar topilmadi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {selectedStatus !== "ALL" || search
                  ? "Tanlangan filtrlar bo'yicha hech qanday buyurtma topilmadi."
                  : "Siz hali birorta ham buyurtma bermagansiz. Bizning yangi mahsulotlar bilan tanishing!"}
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Katalogga o'tish
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString(
                "uz-UZ",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              const canCancel =
                order.status === "PENDING" || order.status === "CONFIRMED";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-5 sm:p-6 transition-all shadow-sm space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            #{order.orderNumber}
                          </h4>
                          <OrderStatusBadge status={order.status} size="sm" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>{formattedDate}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Jami to'lov:
                      </span>
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Items preview and actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Items thumbnails */}
                    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                      {order.items?.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 overflow-hidden shrink-0 relative group"
                          title={`${item.productTitle} (${item.quantity} dona)`}
                        >
                          {item.productImageUrl ? (
                            <img
                              src={item.productImageUrl}
                              alt={item.productTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <span className="absolute bottom-0 right-0 bg-slate-900/80 text-[10px] font-bold text-white px-1 rounded-tl">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items && order.items.length > 4 && (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                          +{order.items.length - 4}
                        </div>
                      )}

                      <div className="ml-2 hidden lg:block text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {order.items?.[0]?.productTitle}
                        {order.items && order.items.length > 1
                          ? ` va yana ${order.items.length - 1} ta`
                          : ""}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {canCancel && (
                        <button
                          onClick={() => handleQuickCancel(order.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Bekor qilish</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tafsilotlar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOrder(null);
        }}
        canCancel={true}
      />

      <Footer />
    </div>
  );
};

export default MyOrders;
