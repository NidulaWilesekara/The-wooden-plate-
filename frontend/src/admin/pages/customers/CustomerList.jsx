import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔸 LOAD CUSTOMERS ONCE
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        const res = await fetch("http://localhost:8000/api/admin/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch customers");

        const data = await res.json();
        setCustomers(data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // 🔸 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch(
        `http://localhost:8000/api/admin/customers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete customer");

      toast.success("Customer deleted successfully");
      // remove from list without reloading whole page
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete customer");
    }
  };

  // 🔸 LOADING STATE
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-orange-600">
          Loading customers...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">Customers</h1>
            <p className="text-sm text-orange-500 mt-2">
              Manage your customers
            </p>
          </div>

          <div
            onClick={() => navigate("/admin/customers/create")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all cursor-pointer font-medium shadow-md hover:shadow-lg"
          >
            + Create Customer
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-orange-500 border-b-2 border-orange-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-orange-100">
              {/* EMPTY STATE */}
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="w-16 h-16 text-orange-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-orange-400 font-medium">
                        No customers found. Create your first customer!
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-orange-600">
                      #{customer.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-800">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-orange-600">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-orange-600">
                      {customer.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-orange-600 max-w-xs truncate">
                      {customer.address || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <div
                          onClick={() =>
                            navigate(`/admin/customers/view/${customer.id}`)
                          }
                          className="p-2.5 bg-orange-100 hover:bg-orange-200 rounded-lg text-orange-600 hover:text-orange-700 transition-all cursor-pointer"
                          title="View"
                        >
                          <svg
                            className="w-5 h-5"
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
                        </div>

                        {/* Edit */}
                        <div
                          onClick={() =>
                            navigate(`/admin/customers/edit/${customer.id}`)
                          }
                          className="p-2.5 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-600 hover:text-yellow-700 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
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
                        </div>

                        {/* Delete */}
                        <div
                          onClick={() => handleDelete(customer.id)}
                          className="p-2.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-500 hover:text-red-700 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
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
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerList;
