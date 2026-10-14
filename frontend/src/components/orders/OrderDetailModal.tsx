import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Ban,
  Package,
} from "lucide-react";
import type { Order } from "../../interfaces/order.interface";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderStatusBadge";
import { OrderTimeline } from "./OrderTimeline";
import { useState } from "react";
import { useOrderStore } from "../../stores/orderStore";
import { toast } from "react-toastify";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  canCancel?: boolean;
}

export const OrderDetailModal = ({
  order,
  isOpen,
  onClose,
  canCancel = false,
}: OrderDetailModalProps) => {
  const { cancelOrder } = useOrderStore();
  const [cancelling, setCancelling] = useState(false);

  if (!isOpen || !order) return null;

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Rostdan ham ushbu buyurtmani bekor qilmoqchimisiz? Mahsulotlar qayta sotuvga chiqariladi."
      )
    ) {
      return;
    }

    setCancelling(true);
    try {
      await cancelOrder(order.id);
      toast.info("Buyurtma bekor qilindi");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  const paymentMethodLabels: Record<string, string> = {
    CASH_ON_DELIVERY: "Naqd pul / Eltib berilganda",
    CARD: "Bank kartasi (Uzcard / Humo / Visa)",
    PAYME: "Payme",
    CLICK: "Click",
    UZUM: "Uzum Bank",
  };

  const formattedDate = new Date(order.createdAt).toLocaleString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/50">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">
                  Buyurtma #{order.orderNumber}
                </h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{formattedDate}</p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`http://localhost:8080/api/v1/orders/track/${order.orderNumber}/invoice-html`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 hover:text-white border border-slate-700 transition-colors"
                title="HTML hisob-fakturasini ko'rish"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Kvitansiya (HTML)</span>
              </a>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Status Timeline */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <OrderTimeline status={order.status} />
            </div>

            {/* Mahsulotlar ro'yxati */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-400" />
                Buyurtma tarkibi ({order.items?.length || 0} ta mahsulot)
              </h4>
              <div className="space-y-2.5">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/30 border border-slate-800/60"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl}
                          alt={item.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-white truncate">
                        {item.productTitle}
                      </h5>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ${item.price.toFixed(2)} × {item.quantity} dona
                      </p>
                    </div>
                    <div className="text-right font-semibold text-white text-sm">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yetkazib berish va to'lov ma'lumotlari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Qabul qiluvchi */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2.5">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Yetkazib berish manzili
                </h5>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{order.customerEmail}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-700/50">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {order.shippingAddress}
                      {order.city ? `, ${order.city}` : ""}
                      {order.postalCode ? ` (${order.postalCode})` : ""}
                    </span>
                  </div>
                  {order.orderNotes && (
                    <div className="flex items-start gap-2 pt-1 text-slate-400 italic">
                      <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>"{order.orderNotes}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* To'lov ma'lumoti */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    To'lov holati
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                        Usul:
                      </span>
                      <span className="text-white font-medium">
                        {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Holat:</span>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/50 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Yetkazib berish:</span>
                    <span className="text-emerald-400 font-medium">Bepul</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-white pt-1">
                    <span>Jami summa:</span>
                    <span className="text-indigo-400">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
            {canCancel &&
            (order.status === "PENDING" || order.status === "CONFIRMED") ? (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Ban className="w-4 h-4" />
                <span>{cancelling ? "Bekor qilinmoqda..." : "Buyurtmani bekor qilish"}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Yopish
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
