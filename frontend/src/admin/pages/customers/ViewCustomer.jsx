import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const ViewCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(
          `http://localhost:8000/api/admin/customers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch customer");

        const result = await response.json();
        setCustomer(result.data || result);
      } catch (error) {
        toast.error("Failed to load customer");
        navigate("/admin/customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!customer) return null;

  // initials for avatar
  const initials = (customer.name || customer.email || "C")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page header + back link */}
        <div className="mb-10 bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">
              Customer Details
            </h1>
            <p className="text-sm text-orange-600 mt-2">
              View customer information
            </p>
          </div>

          <div
            onClick={() => navigate("/admin/customers")}
            className="text-sm text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
          >
            ← Back to Customers
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 md:p-8">
          {/* Top row: avatar + main info */}
          <div className="flex items-center gap-4 md:gap-6 pb-6 mb-6 border-b border-orange-100">
            <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-orange-900">
                {customer.name || "Unnamed Customer"}
              </h2>
              <p className="text-sm text-orange-600 mt-1">
                {customer.email || "No email provided"}
              </p>
              <div className="mt-2 inline-flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-50 text-[11px] font-semibold text-orange-600 uppercase tracking-wide">
                  ID #{customer.id}
                </span>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">
                Phone
              </p>
              <p className="text-sm text-orange-800">
                {customer.phone || "Not provided"}
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">
                Address
              </p>
              <p className="text-sm text-orange-800">
                {customer.address || "Not provided"}
              </p>
            </div>

            {/* Created at */}
            {customer.created_at && (
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">
                  Created At
                </p>
                <p className="text-sm text-orange-700">
                  {new Date(customer.created_at).toLocaleString()}
                </p>
              </div>
            )}

            {/* Updated at (if exists) */}
            {customer.updated_at && (
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">
                  Last Updated
                </p>
                <p className="text-sm text-orange-700">
                  {new Date(customer.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-6 mt-6 border-t border-orange-100">
            <div
              onClick={() => navigate(`/admin/customers/edit/${customer.id}`)}
              className="flex-1 px-6 py-2.5 bg-yellow-500 text-white rounded-lg text-center font-medium hover:bg-yellow-600 cursor-pointer transition-colors"
            >
              Edit Customer
            </div>
            <div
              onClick={() => navigate("/admin/customers")}
              className="flex-1 px-6 py-2.5 bg-orange-100 text-orange-700 rounded-lg text-center font-medium hover:bg-orange-200 cursor-pointer transition-colors"
            >
              Back to List
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewCustomer;
