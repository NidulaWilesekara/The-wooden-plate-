import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const ContactMessageDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:8000/api/admin/contact-messages/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch message");

        const result = await res.json();
        const data = result.data || result;

        setMessage(data);
      } catch (e) {
        toast.error("Failed to load contact message");
        navigate("/admin/contact-messages");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMessage();
  }, [id, navigate, token]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this message? This action cannot be undone."
      )
    ) {
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
        navigate("/admin/contact-messages");
      } catch (e) {
        toast.error("Failed to delete message");
      }
    }
  };

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
                Contact Message from {message?.name || "..."}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {message && new Date(message.created_at).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/contact-messages")}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                         bg-white hover:bg-gray-50 border border-gray-200
                         text-gray-800 text-sm font-medium transition cursor-pointer"
            >
              ← Back to Messages
            </button>
          </div>
        </div>

        {/* ✅ CONTENT */}
        {loading ? (
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-gray-600">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Loading message details...</p>
          </div>
        ) : !message ? (
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-gray-600">
            <p>Message not found</p>
          </div>
        ) : (
          <>
            {/* Sender Information Card */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sender Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Sender Name" value={message.name} />
                <Field label="Email Address" value={message.email} />
              </div>
            </div>

            {/* Message Content Card */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Message</h2>
              </div>
              <div className="p-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Status and Actions Card */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Status</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Current Status:
                  </span>
                  {message.is_read ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      ✓ Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      ● Unread
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
              </div>
              <div className="p-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${message.email}?subject=Re: Your Message to The Wooden Plate`}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                           bg-blue-50 hover:bg-blue-100 border border-blue-200
                           text-blue-700 text-sm font-medium transition cursor-pointer"
                >
                  ✉ Reply via Email
                </a>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                           bg-red-50 hover:bg-red-100 border border-red-200
                           text-red-700 text-sm font-medium transition cursor-pointer"
                >
                  🗑 Delete Message
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactMessageDetail;
