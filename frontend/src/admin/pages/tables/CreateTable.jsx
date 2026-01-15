import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const CreateTable = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    table_number: "",
    chair_count: "",
    is_active: true,
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("admin_token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/admin/tables", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          errorMessages.forEach((msg) => toast.error(msg));
          return;
        }
        throw new Error(data.message || "Failed to create table");
      }

      toast.success("Table created successfully");
      navigate("/admin/tables");
    } catch (error) {
      toast.error(error.message || "Failed to create table");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="w-full md:px-8 px-4">
          {/* Hero Header */}
          <div className="mb-6">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-6 py-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Create Table
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Add a new table to the restaurant
                  </p>
                </div>

                <button
                  onClick={() => navigate("/admin/tables")}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                             bg-white hover:bg-gray-50 border border-gray-200
                             text-gray-800 text-sm font-medium transition cursor-pointer"
                >
                  ← Back to Tables
                </button>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Form header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Table Information
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill required fields and click "Create Table".
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Table Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Table Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="table_number"
                    value={formData.table_number}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 1, A1, VIP-1"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Chair Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Number of Chairs <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="chair_count"
                    value={formData.chair_count}
                    onChange={handleChange}
                    required
                    min="1"
                    max="20"
                    placeholder="e.g., 4"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special notes about this table..."
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Is Active */}
                <div className="md:col-span-2">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      Active (available for reservations)
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg
                             bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                             disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Creating..." : "Create Table"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/tables")}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg
                             bg-gray-100 hover:bg-gray-200 border border-gray-200
                             text-gray-800 text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateTable;
