import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const SettingsList = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("http://localhost:8000/api/admin/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch settings");

      const result = await response.json();
      setSettings(result.data || []);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-orange-600">
          Loading...
        </div>
      </AdminLayout>
    );
  }

  if (settings.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-xl mx-auto text-center mt-16">
          <h1 className="text-2xl font-bold text-orange-600 mb-2">
            Shop Settings
          </h1>
          <p className="text-orange-500 mb-6">
            No settings found. Add your shop details.
          </p>

          <div
            onClick={() => navigate("/admin/settings/create")}
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg cursor-pointer font-medium hover:bg-orange-600 transition shadow-md"
          >
            + Add Settings
          </div>
        </div>
      </AdminLayout>
    );
  }

  // usually only one settings row
  const s = settings[0];
  const cafeName =
    s.cafe_name || s.name || s.shop_name || s.title || "Your Cafe";

  return (
    <AdminLayout>
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shop Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your restaurant details
            </p>
          </div>

          <button
            onClick={() => navigate(`/admin/settings/edit/${s.id}`)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
          >
            Edit Settings
          </button>
        </div>

        {/* Details Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
          {/* Cafe name big at top */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">Cafe Name</p>
            <p className="text-2xl font-bold text-gray-900">
              {cafeName}
            </p>
          </div>

          {/* 2-column info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Email */}
            <InfoField label="Email" value={s.contact_email} />
            {/* Phone */}
            <InfoField label="Phone" value={s.contact_phone} />
            {/* Address full width */}
            <InfoField label="Address" value={s.address} full />

            {/* Opening hours (if any) */}
            {s.opening_hours && (
              <InfoField label="Opening Hours" value={s.opening_hours} full />
            )}

            {/* Social links */}
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Social Links
              </p>
              <div className="flex flex-wrap gap-4 mt-1 text-sm font-medium">
                {s.facebook_url && (
                  <a
                    href={s.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Facebook
                  </a>
                )}
                {s.instagram_url && (
                  <a
                    href={s.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-500 hover:underline"
                  >
                    Instagram
                  </a>
                )}
                {s.twitter_url && (
                  <a
                    href={s.twitter_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-500 hover:underline"
                  >
                    Twitter
                  </a>
                )}
                {s.tiktok_url && (
                  <a
                    href={s.tiktok_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black hover:underline"
                  >
                    TikTok
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Back button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsList;

// small helper component for fields
const InfoField = ({ label, value, full }) => {
  if (!value) return null;
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      <p className="text-sm text-gray-900 font-medium break-words">
        {value}
      </p>
    </div>
  );
};
