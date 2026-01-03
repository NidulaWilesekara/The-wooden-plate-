import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const EditPromotion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "percentage",
    value: "",
    starts_at: "",
    ends_at: "",
    is_active: true,
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      const promotion = data.data;
      
      setFormData({
        ...promotion,
        starts_at: promotion.starts_at ? promotion.starts_at.slice(0, 16) : "",
        ends_at: promotion.ends_at ? promotion.ends_at.slice(0, 16) : "",
      });
    } catch (err) {
      toast.error("Failed to load promotion");
      navigate("/admin/promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `http://localhost:8000/api/admin/promotions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update promotion");

      toast.success("Promotion updated successfully");
      navigate("/admin/promotions");
    } catch (error) {
      toast.error("Failed to update promotion");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl border-l-4 border-indigo-500 shadow-sm">
          <h1 className="text-3xl font-bold text-indigo-600">Edit Promotion</h1>
          <p className="text-sm text-indigo-600 mt-2">
            Update promotion information
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Promotion Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-900 bg-white"
                placeholder="e.g., Weekend Special"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Discount Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-900 bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
                min="0"
                max={formData.type === "percentage" ? "100" : undefined}
                step="0.01"
                className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-900 bg-white"
                placeholder={
                  formData.type === "percentage"
                    ? "e.g., 20 for 20%"
                    : "e.g., 10.00 for $10"
                }
              />
              {formData.type === "percentage" && (
                <p className="text-xs text-indigo-600 mt-1">
                  Maximum value is 100%
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="starts_at"
                value={formData.starts_at}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-900 bg-white"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="ends_at"
                value={formData.ends_at}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-900 bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-indigo-900 bg-white"
                placeholder="Enter promotion description"
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm font-medium text-indigo-700">
                Promotion is active
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 px-6 py-2.5 bg-indigo-500 text-white rounded-lg font-medium transition-colors ${
                  submitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-600"
                }`}
              >
                {submitting ? "Updating..." : "Update Promotion"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/promotions")}
                className="flex-1 px-6 py-2.5 bg-indigo-100 text-indigo-600 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditPromotion;
