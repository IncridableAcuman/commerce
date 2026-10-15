import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Truck,
  FileText,
} from "lucide-react";
import { useOrderStore } from "../stores/orderStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { OrderStatusBadge, PaymentStatusBadge } from "../components/orders/OrderStatusBadge";
import { baseURL } from "../api/axiosInstance";
import { OrderTimeline } from "../components/orders/OrderTimeline";
import type { Order } from "../interfaces/order.interface";
import { toast } from "react-toastify";

export const TrackOrder = () => {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber?: string }>();
  const { trackOrderByNumber, loading } = useOrderStore();

  const [orderNumberInput, setOrderNumberInput] = useState(paramOrderNumber || "");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (paramOrderNumber) {
      setOrderNumberInput(paramOrderNumber);
      handleTrack(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleTrack = async (num: string) => {
    if (!num.trim()) {
      toast.error("Buyurtma raqamini kiriting");
      return;
    }

    setSearched(true);
    try {
      const order = await trackOrderByNumber(num.trim());
      setTrackedOrder(order);
    } catch {
      setTrackedOrder(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(orderNumberInput);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* Sarlavha va qidiruv */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Buyurtmangizni kuzating
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Buyurtma berilganda berilgan unikal raqamni kiriting (masalan,{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">ORD-1728...</span>)
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="ORD-1728900000000-1234..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 shadow-xl transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Qidirilmoqda..." : "Kuzatish"}
            </button>
          </form>
        </div>

        {/* Natija */}
        {trackedOrder ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Buyurtma raqami:
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  #{trackedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>
                    {new Date(trackedOrder.createdAt).toLocaleString("uz-UZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`${baseURL}/orders/track/${trackedOrder.orderNumber}/invoice-html`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
                  title="HTML hisob-fakturasini yangi oynada ochish"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Kvitansiya (HTML)</span>
                </a>
                <OrderStatusBadge status={trackedOrder.status} size="lg" />
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <OrderTimeline status={trackedOrder.status} />
            </div>

            {/* Yetkazib berish va tafsilotlar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Yetkazib berish manzili
                </h4>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {trackedOrder.customerName}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>
                      {trackedOrder.shippingAddress}
                      {trackedOrder.city ? `, ${trackedOrder.city}` : ""}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  To'lov ma'lumoti
                </h4>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">To'lov usuli:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {trackedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Holat:</span>
                    <PaymentStatusBadge status={trackedOrder.paymentStatus} size="sm" />
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700/50">
                    <span>Jami:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      ${trackedOrder.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mahsulotlar */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Buyurtma tarkibi ({trackedOrder.items?.length || 0} ta mahsulot)
              </h4>
              <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {trackedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0">
                        {item.productImageUrl ? (
                          <img
                            src={item.productImageUrl}
                            alt={item.productTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {item.productTitle}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          ${item.price.toFixed(2)} × {item.quantity} dona
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : searched && !loading ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
            <Package className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Buyurtma topilmadi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              "{orderNumberInput}" raqamli buyurtma tizimda topilmadi. Raqam to'g'ri kiritilganligini tekshiring.
            </p>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
