import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const ContactMessagesList = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const token = localStorage.getItem("admin_token");

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/admin/contact-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data.data?.data || data.data || []);
    } catch (e) {
      toast.error("Failed to load contact messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    if (!id) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/contact-messages/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete message");

      toast.success("Message deleted successfully");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setDeleteModal({ open: false, id: null });
    } catch (e) {
      toast.error("Failed to delete message");
    }
  };

  // pagination derived values
  const totalPages = useMemo(
    () => Math.ceil(messages.length / itemsPerPage) || 1,
    [messages.length, itemsPerPage]
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMessages = messages.slice(startIndex, endIndex);

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
                    Contact Messages
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage customer inquiries and feedback
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-600">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p>Loading contact messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600">No contact messages yet</p>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700">
                          Message
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedMessages.map((message) => (
                        <tr
                          key={message.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {message.name}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {message.email}
                          </td>
                          <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                            {message.message}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(message.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {message.is_read ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                ✓ Read
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                ● Unread
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/contact-messages/${message.id}`
                                  )
                                }
                                className="inline-flex items-center justify-center px-3 py-2 rounded-lg
                                         bg-blue-50 hover:bg-blue-100 border border-blue-200
                                         text-blue-700 text-xs font-medium transition cursor-pointer"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteClick(message.id)}
                                className="inline-flex items-center justify-center px-3 py-2 rounded-lg
                                         bg-red-50 hover:bg-red-100 border border-red-200
                                         text-red-700 text-xs font-medium transition cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">
                      Items per page:
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white
                               text-gray-700 text-sm font-medium hover:bg-gray-50 transition
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>

                    <div className="px-4 py-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white
                               text-gray-700 text-sm font-medium hover:bg-gray-50 transition
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 text-right">
                    Total: {messages.length} messages
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <ConfirmModal
          title="Delete Message"
          message="Are you sure you want to delete this contact message? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ open: false, id: null })}
          isDangerous={true}
        />
      )}
    </AdminLayout>
  );
};

export default ContactMessagesList;
