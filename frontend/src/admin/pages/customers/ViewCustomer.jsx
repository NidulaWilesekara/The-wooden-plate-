import React, { useEffect, useMemo, useState } from "react";
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

        const res = await fetch(
          `http://localhost:8000/api/admin/customers/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

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

  const initials = useMemo(() => {
    const base = (customer?.name || customer?.email || "C").trim();
    return base
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [customer]);

  const Field = ({ label, value }) => (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900">
        {value || "—"}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      {/* FULL WIDTH WRAPPER */}
      <div className="w-full">
        {/* ✅ HEADER (full width inside content area) */}
        <div className="mb-6">
          <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-6 py-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Customer Details
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View customer information
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/customers")}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                         bg-white hover:bg-gray-50 border border-gray-200
                         text-gray-800 text-sm font-medium transition cursor-pointer"
            >
              ← Back to Customers
            </button>
          </div>
        </div>

        {/* ✅ CONTENT */}
        {loading ? (
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-gray-600">
            Loading customer...
          </div>
        ) : !customer ? null : (
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* TOP BAR */}
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
              

              {/* title section */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  {customer.name || "Unnamed Customer"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {customer.email || "—"}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  
                </div>
              </div>

              {/* actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/customers/edit/${customer.id}`)}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition cursor-pointer"
                >
                  Edit Customer
                </button>
              </div>
            </div>

            {/* DETAILS GRID (label = value style) */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Name" value={customer.name} />
                <Field label="Email" value={customer.email} />
                <Field label="Phone" value={customer.phone} />
                <Field label="Address" value={customer.address} />

                {customer.created_at && (
                  <Field
                    label="Created At"
                    value={new Date(customer.created_at).toLocaleString()}
                  />
                )}

                {customer.updated_at && (
                  <Field
                    label="Updated At"
                    value={new Date(customer.updated_at).toLocaleString()}
                  />
                )}
              </div>

              {/* bottom buttons */}
              
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewCustomer;
