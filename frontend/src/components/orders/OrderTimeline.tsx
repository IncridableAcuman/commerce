import type { OrderStatus } from "../../interfaces/order.interface";
import { Check, Clock, Package, Truck, CheckCheck, XCircle } from "lucide-react";

interface OrderTimelineProps {
  status: OrderStatus;
}

const steps = [
  { key: "PENDING", label: "Qabul qilindi", icon: Clock },
  { key: "CONFIRMED", label: "Tasdiqlandi", icon: Check },
  { key: "PROCESSING", label: "Tayyorlanmoqda", icon: Package },
  { key: "SHIPPED", label: "Yo'lda", icon: Truck },
  { key: "DELIVERED", label: "Yetkazildi", icon: CheckCheck },
];

const statusOrder: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

export const OrderTimeline = ({ status }: OrderTimelineProps) => {
  if (status === "CANCELLED") {
    return (
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400">
        <XCircle className="w-5 h-5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold">Buyurtma bekor qilingan</h4>
          <p className="text-xs text-rose-300/80">
            Ushbu buyurtma bekor qilingan va mahsulotlar zaxiraga qaytarilgan.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder[status] ?? 0;

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Progress bar background line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 -z-0" />
        
        {/* Active progress fill */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 -z-0"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 48px)",
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                    : isCurrent
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-500/40 animate-pulse"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`mt-2 text-[11px] sm:text-xs font-medium text-center whitespace-nowrap ${
                  isCurrent
                    ? "text-indigo-400 font-semibold"
                    : isCompleted
                    ? "text-emerald-400"
                    : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
