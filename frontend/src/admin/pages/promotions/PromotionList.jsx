import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const PromotionList = () => {
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const token = localStorage.getItem("admin_token");

  const fetchPromotions = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/admin/promotions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch promotions");

      const data = await res.json();
      setPromotions(data.data?.data || data.data || []);
    } catch (e) {
      toast.error("Failed to load promotions");
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    if (!id) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/promotions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete promotion");

      toast.success("Promotion deleted successfully");
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      toast.error("Failed to delete promotion");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/promotions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Promotion ${!currentStatus ? "activated" : "deactivated"} successfully`);
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
      );
    } catch (e) {
      toast.error("Failed to update promotion status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isPromotionActive = (promotion) => {
    if (!promotion.is_active) return false;
    const now = new Date();
    const start = promotion.starts_at ? new Date(promotion.starts_at) : null;
    const end = promotion.ends_at ? new Date(promotion.ends_at) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  };

  // pagination derived values
  const totalPages = useMemo(
    () => Math.ceil(promotions.length / itemsPerPage) || 1,
    [promotions.length, itemsPerPage]
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPromotions = promotions.slice(startIndex, endIndex);

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
                    Promotions
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your promotions
                  </p>
                </div>

                <button
                  onClick={() => navigate("/admin/promotions/create")}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                             bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition cursor-pointer"
                >
                  + Create Promotion
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-visible">
            {/* top bar */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-900">
                Promotion List{" "}
                <span className="text-gray-400 font-normal">
                  ({promotions.length})
                </span>
              </p>

              {promotions.length > 0 && (
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              )}
            </div>

            {loading ? (
              <div className="p-8 text-sm text-gray-600">Loading promotions...</div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      <th className="px-4 py-3 w-16 text-center border-r border-gray-200">
                        ID
                      </th>
                      <th className="px-4 py-3 w-40 text-left border-r border-gray-200">
                        Title
                      </th>
                      <th className="px-4 py-3 w-28 text-center border-r border-gray-200">
                        Type
                      </th>
                      <th className="px-4 py-3 w-24 text-left border-r border-gray-200">
                        Value
                      </th>
                      <th className="px-4 py-3 w-28 text-center border-r border-gray-200">
                        Start Date
                      </th>
                      <th className="px-4 py-3 w-28 text-center border-r border-gray-200">
                        End Date
                      </th>
                      <th className="px-4 py-3 w-28 text-center border-r border-gray-200">
                        Status
                      </th>
                      <th className="px-4 py-3 w-32 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-gray-700">
                    {promotions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-5 py-12 border-t border-gray-200 text-center"
                        >
                          <p className="text-gray-900 font-semibold">
                            No promotions found
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Create your first promotion to see it here.
                          </p>
                          <button
                            onClick={() => navigate("/admin/promotions/create")}
                            className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                          >
                            + Create Promotion
                          </button>
                        </td>
                      </tr>
                    ) : (
                      paginatedPromotions.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 w-16 border-t border-gray-200 border-r border-gray-200 font-semibold text-gray-900 text-center">
                            {p.id}
                          </td>

                          <td className="px-4 py-3 w-40 border-t border-gray-200 border-r border-gray-200 text-left">
                            <div className="truncate text-gray-900">
                              {p.title || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-3 w-28 border-t border-gray-200 border-r border-gray-200 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              p.type === "percentage" 
                                ? "bg-purple-100 text-purple-800" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {p.type === "percentage" ? "Percentage" : "Fixed Amount"}
                            </span>
                          </td>

                          <td className="px-4 py-3 w-24 border-t border-gray-200 border-r border-gray-200 text-left">
                            {p.type === "percentage"
                              ? `${p.value}%`
                              : `Rs. ${parseFloat(p.value || 0).toFixed(2)}`}
                          </td>

                          <td className="px-4 py-3 w-28 border-t border-gray-200 border-r border-gray-200 text-center text-xs text-gray-600">
                            {formatDate(p.starts_at)}
                          </td>

                          <td className="px-4 py-3 w-28 border-t border-gray-200 border-r border-gray-200 text-center text-xs text-gray-600">
                            {formatDate(p.ends_at)}
                          </td>

                          <td className="px-4 py-3 w-28 border-t border-gray-200 border-r border-gray-200 text-center">
                            <button
                              onClick={() => handleToggleStatus(p.id, p.is_active)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                p.is_active ? "bg-green-500" : "bg-gray-300"
                              }`}
                              title={p.is_active ? "Click to deactivate" : "Click to activate"}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  p.is_active ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3 w-32 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-6">
                              {/* VIEW */}
                              <button
                                onClick={() =>
                                  navigate(`/admin/promotions/view/${p.id}`)
                                }
                                title="View"
                                className="p-1.5 rounded-md border border-blue-200 bg-blue-50 
                                           text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>

                              {/* EDIT */}
                              <button
                                onClick={() =>
                                  navigate(`/admin/promotions/edit/${p.id}`)
                                }
                                title="Edit"
                                className="p-1.5 rounded-md border border-gray-300 bg-gray-100 
                                           text-gray-800 hover:bg-gray-200 transition cursor-pointer"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>

                              {/* DELETE */}
                              <button
                                onClick={() => handleDeleteClick(p.id)}
                                title="Delete"
                                className="p-1.5 rounded-md border border-red-200 bg-red-50 
                                           text-red-600 hover:bg-red-100 transition cursor-pointer"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination footer */}
            {!loading && promotions.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(endIndex, promotions.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {promotions.length}
                  </span>{" "}
                  results
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700
                               hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>

                  <button
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                    disabled
                  >
                    {currentPage} / {totalPages}
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700
                               hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Promotion"
        message="Are you sure you want to delete this promotion? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
};

export default PromotionList;
