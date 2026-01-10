import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const TableList = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    fetchTables();
  }, [searchTerm, statusFilter]);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams();
      
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("is_active", statusFilter === "active" ? "1" : "0");

      const response = await fetch(`http://localhost:8000/api/admin/tables?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setTables(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch tables");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    if (!id) return;

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`http://localhost:8000/api/admin/tables/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Table deleted successfully");
        fetchTables();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete table");
    }
  };

  const toggleStatus = async (table) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`http://localhost:8000/api/admin/tables/${table.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...table,
          is_active: !table.is_active,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Status updated successfully");
        fetchTables();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
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

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tables Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your restaurant tables (Create / View / Edit / Delete)
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/tables/create")}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
          >
            + Add Table
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Top Bar */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              Table List
              <span className="text-gray-400 font-normal"> ({tables.length})</span>
            </p>

            <button
              onClick={fetchTables}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-sm text-gray-700"
            >
              Refresh
            </button>
          </div>

          {tables.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-900 font-semibold">No tables found</p>
              <p className="text-sm text-gray-500 mt-1">
                Create your first table to see it here.
              </p>

              <button
                onClick={() => navigate("/admin/tables/create")}
                className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
              >
                + Add Table
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[700px] w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <th className="px-5 py-3">Table Number</th>
                    <th className="px-5 py-3">Chairs</th>
                    <th className="px-5 py-3">Reservations</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tables.map((table) => (
                    <tr key={table.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          Table {table.table_number}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {table.chair_count} chairs
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {table.reservations_count || 0} reservations
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleStatus(table)}
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            table.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {table.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/tables/${table.id}/edit`)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDeleteClick(table.id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
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

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Table"
        message="Are you sure you want to delete this table? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
};

export default TableList;
