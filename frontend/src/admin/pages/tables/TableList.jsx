import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const TableList = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetchTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/admin/tables", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setTables(data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch tables");
      setTables([]);
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
        setTables((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast.error(data.message || "Failed to delete table");
      }
    } catch (error) {
      toast.error("Failed to delete table");
    }
  };

  const toggleStatus = async (table) => {
    try {
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

  // Pagination derived values
  const totalPages = useMemo(
    () => Math.ceil(tables.length / itemsPerPage) || 1,
    [tables.length, itemsPerPage]
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTables = tables.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="w-full md:px-8 px-4">
          {/* Header card */}
          <div className="mb-6">
            <div className="bg-gray-100 border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Tables
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage restaurant tables
                  </p>
                </div>

                <button
                  onClick={() => navigate("/admin/tables/create")}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                             bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition cursor-pointer"
                >
                  + Add Table
                </button>
              </div>
            </div>
          </div>

          {/* Table card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Top bar */}
            <div className="px-5 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm font-medium text-gray-900">
                Table List
                <span className="text-gray-400 font-normal"> ({tables.length})</span>
              </p>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Show</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="p-10 text-center text-gray-600">Loading tables...</div>
            ) : tables.length === 0 ? (
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
              <>
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50">
                        <th className="px-5 py-3 border-b border-gray-200">Table #</th>
                        <th className="px-5 py-3 border-b border-gray-200">Chairs</th>
                        <th className="px-5 py-3 border-b border-gray-200">Status</th>
                        <th className="px-5 py-3 border-b border-gray-200">Notes</th>
                        <th className="px-5 py-3 border-b border-gray-200 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTables.map((table, idx) => (
                        <tr
                          key={table.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                        >
                          <td className="px-5 py-4 border-b border-gray-100">
                            <span className="font-medium text-gray-900">
                              Table {table.table_number}
                            </span>
                          </td>
                          <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-600">
                            {table.chair_count} chairs
                          </td>
                          <td className="px-5 py-4 border-b border-gray-100">
                            <button
                              onClick={() => toggleStatus(table)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                table.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {table.is_active ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-600 max-w-xs truncate">
                            {table.notes || "—"}
                          </td>
                          <td className="px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-center gap-2">
                              {/* View */}
                              <button
                                onClick={() => navigate(`/admin/tables/${table.id}`)}
                                className="p-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600
                                           hover:bg-blue-100 transition"
                                title="View"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => navigate(`/admin/tables/${table.id}/edit`)}
                                className="p-1.5 rounded-md border border-gray-300 bg-gray-100 text-gray-800
                                           hover:bg-gray-200 transition"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteClick(table.id)}
                                className="p-1.5 rounded-md border border-red-200 bg-red-50 text-red-600
                                           hover:bg-red-100 transition"
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

                {/* Pagination */}
                <div className="px-5 py-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, tables.length)} of {tables.length} entries
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700
                                 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .reduce((acc, page, idx, arr) => {
                        if (idx > 0 && page - arr[idx - 1] > 1) {
                          acc.push("...");
                        }
                        acc.push(page);
                        return acc;
                      }, [])
                      .map((page, idx) =>
                        page === "..." ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                              currentPage === page
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700
                                 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
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
