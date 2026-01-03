import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const ViewCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/admin/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch customer");

        const result = await res.json();
        const data = result.data || result;

        setCustomer(data);
      } catch (e) {
        toast.error("Failed to load customer");
        navigate("/admin/customers");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomer();
  }, [id, navigate, token]);

  const initials = (customer?.name || customer?.email || "C")
    .split(" ")
    .map((n) => n?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Customer Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View customer information
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/customers")}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 text-sm font-medium"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-gray-600">
            Loading customer...
          </div>
        ) : !customer ? null : (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
            {/* top row */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 pb-6 mb-6 border-b border-gray-200">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">{initials}</span>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {customer.name || "Unnamed Customer"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{customer.email || "—"}</p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    ID #{customer.id}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/customers/edit/${customer.id}`)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                  Phone
                </p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900">
                  {customer.phone || "—"}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                  Address
                </p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900">
                  {customer.address || "—"}
                </div>
              </div>

              {customer.created_at && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                    Created At
                  </p>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900">
                    {new Date(customer.created_at).toLocaleString()}
                  </div>
                </div>
              )}

              {customer.updated_at && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                    Updated At
                  </p>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900">
                    {new Date(customer.updated_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewCustomer;
