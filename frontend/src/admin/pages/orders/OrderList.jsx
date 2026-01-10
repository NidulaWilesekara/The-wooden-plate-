import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  // Load Orders
  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const url = filterStatus
        ? `http://localhost:8000/api/admin/orders?status=${filterStatus}`
        : "http://localhost:8000/api/admin/orders";

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(
        `http://localhost:8000/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      toast.success("Order status updated successfully");
      fetchOrders(); // Reload
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  // Get Status Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get Lock Icon
  const getLockIcon = (isLocked) => {
    if (!isLocked) return null;
    return (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all customer orders
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>
            {filterStatus && (
              <button
                onClick={() => setFilterStatus("")}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Top Bar */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              Order List
              <span className="text-gray-400 font-normal"> ({orders.length})</span>
            </p>

            <button
              onClick={fetchOrders}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-sm text-gray-700"
            >
              Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-900 font-semibold">No orders found</p>
              <p className="text-sm text-gray-500 mt-1">
                Orders will appear here when customers place them.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1000px] w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Total Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            #{String(order.id).padStart(6, "0")}
                          </span>
                          {getLockIcon(order.is_locked)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer?.email || ""}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/orders/view/${order.id}`)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <a
                            href={`http://localhost:8000/api/orders/${order.id}/invoice`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-colors"
                            title="Invoice"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="rounded-2xl bg-yellow-50 p-5 border border-yellow-200 shadow-sm">
            <div className="text-sm text-yellow-600 font-semibold">Pending</div>
            <div className="text-2xl font-bold text-yellow-800 mt-1">
              {orders.filter((o) => o.status === "pending").length}
            </div>
          </div>
          <div className="rounded-2xl bg-blue-50 p-5 border border-blue-200 shadow-sm">
            <div className="text-sm text-blue-600 font-semibold">Preparing</div>
            <div className="text-2xl font-bold text-blue-800 mt-1">
              {orders.filter((o) => o.status === "preparing").length}
            </div>
          </div>
          <div className="rounded-2xl bg-purple-50 p-5 border border-purple-200 shadow-sm">
            <div className="text-sm text-purple-600 font-semibold">Ready</div>
            <div className="text-2xl font-bold text-purple-800 mt-1">
              {orders.filter((o) => o.status === "ready").length}
            </div>
          </div>
          <div className="rounded-2xl bg-green-50 p-5 border border-green-200 shadow-sm">
            <div className="text-sm text-green-600 font-semibold">Completed</div>
            <div className="text-2xl font-bold text-green-800 mt-1">
              {orders.filter((o) => o.status === "completed").length}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderList;
