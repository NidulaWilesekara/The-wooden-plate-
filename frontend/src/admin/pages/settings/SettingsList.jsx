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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">Shop Settings</h1>
            <p className="text-sm text-orange-500 mt-1">
              Manage your restaurant details
            </p>
          </div>

          <div
            onClick={() => navigate(`/admin/settings/edit/${s.id}`)}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition shadow"
          >
            Edit Settings
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-md border border-orange-100 p-8">
          {/* Cafe name big at top */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-orange-500">Cafe Name</p>
            <p className="mt-1 text-2xl font-bold text-orange-800">
              {cafeName}
            </p>
          </div>

          {/* 2-column info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left">
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
              <p className="text-xs font-semibold text-orange-500 mb-1">
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
          <div className="flex justify-end mt-8">
            <div
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-2.5 bg-orange-100 text-orange-600 rounded-lg cursor-pointer hover:bg-orange-200 transition"
            >
              Back to Dashboard
            </div>
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
      <p className="text-xs font-semibold text-orange-500 mb-1">{label}</p>
      <p className="text-sm text-orange-900 font-medium break-words">
        {value}
      </p>
    </div>
  );
};
