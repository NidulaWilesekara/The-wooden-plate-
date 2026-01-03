import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const ViewPromotion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotion();
  }, [id]);

  const fetchPromotion = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(
        `http://localhost:8000/api/admin/promotions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch promotion");

      const data = await res.json();
      setPromotion(data.data);
    } catch (err) {
      toast.error("Failed to load promotion");
      navigate("/admin/promotions");
    } finally {
      setLoading(false);
    }
  };

  const isPromotionActive = () => {
    if (!promotion || !promotion.is_active) return false;

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
          <div className="text-lg">Loading promotion...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!promotion) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-red-600">Promotion not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Promotion Details
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/promotions/edit/${promotion.id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Edit Promotion
            </button>
            <button
              onClick={() => navigate("/admin/promotions")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Promotions
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Promotion Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Promotion Title
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {promotion.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Type
                  </label>
                  <p className="text-gray-900">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {promotion.type === "percentage"
                        ? "Percentage"
                        : "Fixed Amount"}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Discount Value
                  </label>
                  <p className="text-2xl font-bold text-purple-600">
                    {promotion.type === "percentage"
                      ? `${promotion.value}%`
                      : `$${parseFloat(promotion.value).toFixed(2)}`}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded border-l-4 border-purple-500">
                  {promotion.description || "No description available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Start Date
                  </label>
                  <p className="text-gray-900">
                    {promotion.starts_at
                      ? new Date(promotion.starts_at).toLocaleString()
                      : "No start date"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    End Date
                  </label>
                  <p className="text-gray-900">
                    {promotion.ends_at
                      ? new Date(promotion.ends_at).toLocaleString()
                      : "No end date"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Meta */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Status
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Current Status
                  </label>
                  <div className="mt-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        isPromotionActive()
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isPromotionActive() ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Admin Enabled
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        promotion.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {promotion.is_active ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {promotion.starts_at && (
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Started
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          new Date() >= new Date(promotion.starts_at)
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {new Date() >= new Date(promotion.starts_at)
                          ? "Yes"
                          : "Not Yet"}
                      </span>
                    </div>
                  </div>
                )}

                {promotion.ends_at && (
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Expired
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          new Date() > new Date(promotion.ends_at)
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {new Date() > new Date(promotion.ends_at)
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Additional Info
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Promotion ID:</span>
                  <span className="font-semibold">#{promotion.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-semibold">
                    {new Date(promotion.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-semibold">
                    {new Date(promotion.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewPromotion;
