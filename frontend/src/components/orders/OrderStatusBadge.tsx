import type { OrderStatus, PaymentStatus } from "../../interfaces/order.interface";
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  CheckCheck,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
}

export const OrderStatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-medium gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold gap-2",
  };

  switch (status) {
    case "PENDING":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses[size]}`}
        >
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          Kutilmoqda
        </span>
      );
    case "CONFIRMED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ${sizeClasses[size]}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Tasdiqlandi
        </span>
      );
    case "PROCESSING":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 ${sizeClasses[size]}`}
        >
          <Package className="w-3.5 h-3.5" />
          Tayyorlanmoqda
        </span>
      );
    case "SHIPPED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ${sizeClasses[size]}`}
        >
          <Truck className="w-3.5 h-3.5" />
          Yo'lda
        </span>
      );
    case "DELIVERED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses[size]}`}
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Yetkazildi
        </span>
      );
    case "CANCELLED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 ${sizeClasses[size]}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Bekor qilindi
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
};

export const PaymentStatusBadge = ({
  status,
  size = "md",
}: {
  status: PaymentStatus;
  size?: "sm" | "md";
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs font-medium",
  };

  switch (status) {
    case "PAID":
      return (
        <span
          className={`inline-flex items-center rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses[size]}`}
        >
          To'langan
        </span>
      );
    case "PENDING":
      return (
        <span
          className={`inline-flex items-center rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 ${sizeClasses[size]}`}
        >
          Kutilmoqda
        </span>
      );
    case "REFUNDED":
      return (
        <span
          className={`inline-flex items-center rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 ${sizeClasses[size]}`}
        >
          Qaytarilgan
        </span>
      );
    case "FAILED":
      return (
        <span
          className={`inline-flex items-center rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 ${sizeClasses[size]}`}
        >
          To'lanmagan
        </span>
      );
    default:
      return null;
  }
};
