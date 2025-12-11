import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("http://localhost:8000/api/admin/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create customer");

      toast.success("Customer created successfully");
      navigate("/admin/customers");
    } catch (error) {
      toast.error("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border-l-4 border-orange-500 shadow-sm">
          <h1 className="text-3xl font-bold text-orange-600">Create Customer</h1>
          <p className="text-sm text-orange-600 mt-2">
            Add a new customer to the system
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-900 bg-white"
                placeholder="Enter customer name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-900 bg-white"
                placeholder="customer@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Phone *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-orange-900 bg-white"
                placeholder="Enter phone number"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-orange-900 bg-white"
                placeholder="Enter full address"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <div
                onClick={handleSubmit}
                className={`flex-1 px-6 py-2.5 bg-orange-500 text-white rounded-lg text-center font-medium transition-colors cursor-pointer ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-600"
                }`}
              >
                {loading ? "Creating..." : "Create Customer"}
              </div>
              <div
                onClick={() => navigate("/admin/customers")}
                className="flex-1 px-6 py-2.5 bg-orange-100 text-orange-600 rounded-lg text-center font-medium hover:bg-orange-200 transition-colors cursor-pointer"
              >
                Cancel
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateCustomer;
