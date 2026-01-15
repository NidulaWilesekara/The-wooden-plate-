import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const ReservationList = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, searchTerm, dateFilter]);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams();
      
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);
      if (dateFilter) params.append("date", dateFilter);

      const response = await fetch(`http://localhost:8000/api/admin/reservations?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setReservations(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`http://localhost:8000/api/admin/reservations/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchReservations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      no_show: "bg-gray-100 text-gray-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const stats = {
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    total: reservations.length,
  };

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Reservations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage customer table reservations
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-5 shadow-sm">
            <div className="text-yellow-600 text-sm font-medium">Pending</div>
            <div className="text-3xl font-bold text-yellow-900 mt-1">{stats.pending}</div>
          </div>
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5 shadow-sm">
            <div className="text-green-600 text-sm font-medium">Confirmed</div>
            <div className="text-3xl font-bold text-green-900 mt-1">{stats.confirmed}</div>
          </div>
          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5 shadow-sm">
            <div className="text-blue-600 text-sm font-medium">Total</div>
            <div className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Top Bar */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              Reservation List
              <span className="text-gray-400 font-normal"> ({reservations.length})</span>
            </p>

            <button
              onClick={fetchReservations}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-sm text-gray-700"
            >
              Refresh
            </button>
          </div>

          {reservations.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-900 font-semibold">No reservations found</p>
              <p className="text-sm text-gray-500 mt-1">
                Reservations will appear here when customers book tables.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1000px] w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Table</th>
                    <th className="px-5 py-3">Date & Time</th>
                    <th className="px-5 py-3">Party Size</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.customer?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.customer?.email}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          Table {reservation.table?.table_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.table?.chair_count} chairs
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(reservation.reservation_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.start_time} - {reservation.end_time}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-900">
                        {reservation.party_size} people
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            reservation.status
                          )}`}
                        >
                          {reservation.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {reservation.status === "pending" && (
                            <button
                              onClick={() => updateStatus(reservation.id, "confirmed")}
                              className="px-3 py-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-medium"
                            >
                              Confirm
                            </button>
                          )}
                          {(reservation.status === "pending" || reservation.status === "confirmed") && (
                            <button
                              onClick={() => updateStatus(reservation.id, "cancelled")}
                              className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          {reservation.status === "confirmed" && (
                            <button
                              onClick={() => updateStatus(reservation.id, "completed")}
                              className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReservationList;
