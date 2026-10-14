import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useOrderStore } from "../../stores/orderStore";
import { PaymentStatusBadge } from "../orders/OrderStatusBadge";
import { OrderDetailModal } from "../orders/OrderDetailModal";
import type { Order, OrderStatus } from "../../interfaces/order.interface";
import { toast } from "react-toastify";

export const OrderManagement = () => {
  const {
    adminOrders,
    adminLoading,
    adminTotalPages,
    fetchAdminOrders,
    updateAdminOrderStatus,
  } = useOrderStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminOrders(search, statusFilter, currentPage);
  }, [search, statusFilter, currentPage, fetchAdminOrders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchAdminOrders(search, statusFilter, 0);
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      toast.success(`Buyurtma holati "${newStatus}" ga o'zgartirildi`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Buyurtmalar nazorati
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mijozlar buyurtmalarini ko'rish, qidirish, statusini yangilash va yetkazib berish jarayonini boshqarish
          </p>
        </div>

        <button
          onClick={() => fetchAdminOrders(search, statusFilter, currentPage)}
          disabled={adminLoading}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${adminLoading ? "animate-spin" : ""}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* 2. Filtrlash va qidiruv */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Raqam, ism, email yoki telefon..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as OrderStatus | "");
                setCurrentPage(0);
              }}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="" className="bg-slate-900 text-slate-200">
                Barcha statuslar
              </option>
              <option value="PENDING" className="bg-slate-900 text-slate-200">
                Kutilmoqda
              </option>
              <option value="CONFIRMED" className="bg-slate-900 text-slate-200">
                Tasdiqlandi
              </option>
              <option value="PROCESSING" className="bg-slate-900 text-slate-200">
                Tayyorlanmoqda
              </option>
              <option value="SHIPPED" className="bg-slate-900 text-slate-200">
                Yo'lda
              </option>
              <option value="DELIVERED" className="bg-slate-900 text-slate-200">
                Yetkazildi
              </option>
              <option value="CANCELLED" className="bg-slate-900 text-slate-200">
                Bekor qilindi
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Jadval */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {adminLoading && adminOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Buyurtmalar yuklanmoqda...</p>
          </div>
        ) : adminOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3 text-slate-400">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-white">Hech qanday buyurtma topilmadi</p>
            <p className="text-xs text-slate-500">Qidiruv yoki status filtrini o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Buyurtma</th>
                  <th className="py-4 px-6">Mijoz</th>
                  <th className="py-4 px-6">Mahsulotlar</th>
                  <th className="py-4 px-6">Jami summa</th>
                  <th className="py-4 px-6">To'lov</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {adminOrders.map((order) => {
                  const formattedDate = new Date(order.createdAt).toLocaleDateString("uz-UZ", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Buyurtma kodi va sana */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-white">#{order.orderNumber}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{formattedDate}</div>
                      </td>

                      {/* Mijoz */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                          {order.shippingAddress}
                        </div>
                      </td>

                      {/* Mahsulotlar */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-slate-300 font-medium">
                          {order.items?.length || 0} xil mahsulot
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {order.items?.[0]?.productTitle}
                        </div>
                      </td>

                      {/* Jami summa */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-extrabold text-white text-sm">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </td>

                      {/* To'lov */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                        <div className="text-[10px] text-slate-500 mt-1">{order.paymentMethod}</div>
                      </td>

                      {/* Status (Selector) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500 cursor-pointer font-medium"
                        >
                          <option value="PENDING">Kutilmoqda</option>
                          <option value="CONFIRMED">Tasdiqlandi</option>
                          <option value="PROCESSING">Tayyorlanmoqda</option>
                          <option value="SHIPPED">Yo'lda</option>
                          <option value="DELIVERED">Yetkazildi</option>
                          <option value="CANCELLED">Bekor qilindi</option>
                        </select>
                      </td>

                      {/* Amallar */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Tafsilotlar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {adminTotalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Sahifa {currentPage + 1} / {adminTotalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, adminTotalPages - 1))}
                disabled={currentPage >= adminTotalPages - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};
