import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

const stats = [
  {
    title: "Revenue",
    value: "$12,450",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "320",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    value: "1,200",
    icon: Users,
  },
  {
    title: "Products",
    value: "85",
    icon: Package,
  },
];

const orders = [
  { id: "#1001", user: "John Doe", total: "$120", status: "Paid" },
  { id: "#1002", user: "Jane Smith", total: "$80", status: "Pending" },
  { id: "#1003", user: "Ali Khan", total: "$200", status: "Paid" },
  { id: "#1004", user: "Sara Lee", total: "$150", status: "Cancelled" },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500">{item.title}</p>
                <h2 className="text-xl font-semibold">{item.value}</h2>
              </div>
              <Icon className="text-gray-400" size={28} />
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3">{order.id}</td>
                  <td>{order.user}</td>
                  <td>{order.total}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;