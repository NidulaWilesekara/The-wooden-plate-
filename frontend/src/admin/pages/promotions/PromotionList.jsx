import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const PromotionList = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState("");
  const [filterType, setFilterType] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    fetchPromotions();
  }, [filterActive, filterType]);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      let url = "http://localhost:8000/api/admin/promotions?";
      
      if (filterActive) url += `active=${filterActive}&`;
      if (filterType) url += `type=${filterType}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch promotions");

      const data = await res.json();
      setPromotions(data.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load promotions");
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

      const res = await fetch(
        `http://localhost:8000/api/admin/promotions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete promotion");

      toast.success("Promotion deleted successfully");
      fetchPromotions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete promotion");
    }
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading promotions...</div>
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
              Promotions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your promotions (Create / View / Edit / Delete)
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/promotions/create")}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
          >
            + Add Promotion
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">
                Type:
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">
                Status:
              </label>
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            {(filterType || filterActive) && (
              <button
                onClick={() => {
                  setFilterType("");
                  setFilterActive("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* top bar */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              Promotion List
              <span className="text-gray-400 font-normal"> ({promotions.length})</span>
            </p>

            <button
              onClick={fetchPromotions}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-sm text-gray-700"
            >
              Refresh
            </button>
          </div>

          {promotions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-900 font-semibold">No promotions found</p>
              <p className="text-sm text-gray-500 mt-1">
                Create your first promotion to see it here.
              </p>

              <button
                onClick={() => navigate("/admin/promotions/create")}
                className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
              >
                + Add Promotion
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Value</th>
                    <th className="px-5 py-3">Validity</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {promotions.map((promotion) => (
                    <tr key={promotion.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {promotion.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {promotion.description?.substring(0, 40)}...
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {promotion.type === "percentage"
                            ? "Percentage"
                            : "Fixed"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {promotion.type === "percentage"
                          ? `${promotion.value}%`
                          : `$${parseFloat(promotion.value).toFixed(2)}`}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {promotion.starts_at && (
                          <div>
                            From: {new Date(promotion.starts_at).toLocaleDateString()}
                          </div>
                        )}
                        {promotion.ends_at && (
                          <div>
                            To: {new Date(promotion.ends_at).toLocaleDateString()}
                          </div>
                        )}
                        {!promotion.starts_at && !promotion.ends_at && "No limit"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isPromotionActive(promotion)
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isPromotionActive(promotion) ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/promotions/view/${promotion.id}`)
                            }
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/promotions/edit/${promotion.id}`)
                            }
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDeleteClick(promotion.id)}
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
