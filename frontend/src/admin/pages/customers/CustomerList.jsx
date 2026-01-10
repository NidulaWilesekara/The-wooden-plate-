import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const CustomerList = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const token = localStorage.getItem("admin_token");

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/admin/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch customers");

      const data = await res.json();
      setCustomers(data.data || []);
    } catch (e) {
      toast.error("Failed to load customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    if (!id) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete customer");

      toast.success("Customer deleted successfully");
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      toast.error("Failed to delete customer");
    }
  };

  // pagination derived values
  const totalPages = useMemo(
    () => Math.ceil(customers.length / itemsPerPage) || 1,
    [customers.length, itemsPerPage]
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = customers.slice(startIndex, endIndex);

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
                    Customers
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your customers
                  </p>
                </div>

                <button
                  onClick={() => navigate("/admin/customers/create")}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                             bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition cursor-pointer"
                >
                  + Create Customer
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-visible">
            {/* top bar */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-900">
                Customer List{" "}
                <span className="text-gray-400 font-normal">
                  ({customers.length})
                </span>
              </p>

              {customers.length > 0 && (
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
              <div className="p-8 text-sm text-gray-600">Loading customers...</div>
            ) : (
              <div className="w-full">
                <table className="w-full border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      <th className="px-4 py-3 w-16 text-center border-r border-gray-200">
                        ID
                      </th>
                      <th className="px-4 py-3 w-40 text-left border-r border-gray-200">
                        Name
                      </th>
                      <th className="px-4 py-3 w-52 text-left border-r border-gray-200">
                        Email
                      </th>
                      <th className="px-4 py-3 w-28 text-center border-r border-gray-200">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left border-r border-gray-200">
                        Address
                      </th>
                      <th className="px-4 py-3 w-32 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-gray-700">
                    {customers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12 border-t border-gray-200 text-center"
                        >
                          <p className="text-gray-900 font-semibold">
                            No customers found
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Create your first customer to see it here.
                          </p>
                          <button
                            onClick={() => navigate("/admin/customers/create")}
                            className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                          >
                            + Create Customer
                          </button>
                        </td>
                      </tr>
                    ) : (
                      paginatedCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 w-16 border-t border-gray-200 border-r border-gray-200 font-semibold text-gray-900 text-center">
                            {c.id}
                          </td>

                          <td className="px-4 py-3 w-60 border-t border-gray-200 border-r border-gray-200 text-left">
                            <div className="truncate text-gray-900">
                              {c.name || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-3 w-55 border-t border-gray-200 border-r border-gray-200 text-left">
                            <div className="truncate">
                              {c.email || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-3 w-30 border-t border-gray-200 border-r border-gray-200 text-left">
                            {c.phone || "—"}
                          </td>

                          <td className="px-4 py-3 border-t border-gray-200 border-r border-gray-200 text-left">
                            <div className="truncate max-w-xs">
                              {c.address || "—"}
                            </div>
                          </td>

                          {/* Actions: icons only */}
                          <td className="px-5 py-3 w-32 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-6">
                              {/* VIEW */}
                              <button
                                onClick={() =>
                                  navigate(`/admin/customers/view/${c.id}`)
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
                                  navigate(`/admin/customers/edit/${c.id}`)
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
                                onClick={() => handleDeleteClick(c.id)}
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
            {!loading && customers.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(endIndex, customers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {customers.length}
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
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
};

export default CustomerList;
