import { Eye, Trash2 } from "lucide-react";

const orders = [
  {
    id: "#1001",
    customer: "John Doe",
    date: "2026-04-10",
    total: "$120",
    status: "Paid",
  },
  {
    id: "#1002",
    customer: "Jane Smith",
    date: "2026-04-11",
    total: "$80",
    status: "Pending",
  },
  {
    id: "#1003",
    customer: "Ali Khan",
    date: "2026-04-12",
    total: "$200",
    status: "Delivered",
  },
  {
    id: "#1004",
    customer: "Sara Lee",
    date: "2026-04-13",
    total: "$150",
    status: "Cancelled",
  },
];

const getStatusStyle = (status:string) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-yellow-100 text-yellow-600";
    case "Delivered":
      return "bg-blue-100 text-blue-600";
    case "Cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Orders = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3">Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.total}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-right space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-100 text-red-500">
                      <Trash2 size={18} />
                    </button>
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

export default Orders;