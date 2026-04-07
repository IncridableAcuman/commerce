import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Clock,
  Loader2,
} from "lucide-react";
import adminAxiosInstance from "../api/axiosInstance";

interface Stats {
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  productGrowth: number;
  userGrowth: number;
  revenueGrowth: number;
  orderGrowth: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  date: string;
}

const statusConfig = {
  COMPLETED: { label: "Completed", cls: "bg-green-50 text-green-500" },
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-500" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-50 text-red-400" },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/auth");
      return;
    }
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          adminAxiosInstance.get("/dashboard/stats"),
          adminAxiosInstance.get("/dashboard/recent-orders"),
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const statCards = stats
    ? [
        {
          label: "Total revenue",
          value: `$${stats.totalRevenue.toLocaleString()}`,
          growth: stats.revenueGrowth,
          icon: <DollarSign size={16} />,
          color: "text-teal-500",
          bg: "bg-teal-50",
        },
        {
          label: "Total orders",
          value: stats.totalOrders.toLocaleString(),
          growth: stats.orderGrowth,
          icon: <ShoppingBag size={16} />,
          color: "text-blue-500",
          bg: "bg-blue-50",
        },
        {
          label: "Total products",
          value: stats.totalProducts.toLocaleString(),
          growth: stats.productGrowth,
          icon: <Package size={16} />,
          color: "text-purple-500",
          bg: "bg-purple-50",
        },
        {
          label: "Total users",
          value: stats.totalUsers.toLocaleString(),
          growth: stats.userGrowth,
          icon: <Users size={16} />,
          color: "text-amber-500",
          bg: "bg-amber-50",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={22} className="text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Xush kelibsiz! Bu yerda umumiy ko'rsatkichlar.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-100 rounded-lg px-3 py-2">
          <Clock size={12} />
          {new Date().toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {card.label}
              </p>
              <div className={`w-8 h-8 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-medium text-gray-900">{card.value}</p>
            <div className="flex items-center gap-1">
              {card.growth >= 0 ? (
                <ArrowUpRight size={13} className="text-green-500" />
              ) : (
                <ArrowDownRight size={13} className="text-red-400" />
              )}
              <span className={`text-xs font-medium ${card.growth >= 0 ? "text-green-500" : "text-red-400"}`}>
                {Math.abs(card.growth)}%
              </span>
              <span className="text-xs text-gray-400">o'tgan oyga nisbatan</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">So'nggi buyurtmalar</p>
            <button
              onClick={() => navigate("/orders")}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
            >
              Barchasini ko'rish
              <ArrowUpRight size={11} />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <ShoppingBag size={28} className="text-gray-200" />
              <p className="text-sm text-gray-400">Buyurtmalar yo'q</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Mijoz", "Mahsulot", "Summa", "Status", "Sana"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white text-xs font-medium shrink-0">
                          {order.customerName[0]}
                        </div>
                        <span className="text-sm text-gray-700 truncate max-w-25">
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-500 truncate max-w-30 block">
                        {order.product}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-gray-900">
                        ${order.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig[order.status].cls}`}>
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-400">
                        {new Date(order.date).toLocaleDateString("uz-UZ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-medium text-gray-900">Tezkor amallar</p>
          <div className="space-y-2">
            {[
              {
                label: "Mahsulot qo'shish",
                desc: "Yangi item yaratish",
                icon: <Package size={15} />,
                color: "text-purple-500 bg-purple-50",
                path: "/add-items",
              },
              {
                label: "Foydalanuvchilar",
                desc: "Ro'yxatni boshqarish",
                icon: <Users size={15} />,
                color: "text-blue-500 bg-blue-50",
                path: "/users",
              },
              {
                label: "Hisobot",
                desc: "Ko'rsatkichlarni ko'rish",
                icon: <TrendingUp size={15} />,
                color: "text-teal-500 bg-teal-50",
                path: "/analytics",
              },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-150 text-left"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{action.label}</p>
                  <p className="text-xs text-gray-400">{action.desc}</p>
                </div>
                <ArrowUpRight size={13} className="text-gray-300 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;