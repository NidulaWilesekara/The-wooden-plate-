import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const ViewSetting = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(
          `http://localhost:8000/api/admin/details/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch setting");

        const result = await response.json();
        setSetting(result.data || result);
      } catch (error) {
        toast.error("Failed to load setting");
        navigate("/admin/settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
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

  if (!setting) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-600">Setting not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-10 bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">
              Shop Settings Details
            </h1>
            <p className="text-sm text-orange-600 mt-2">
              View complete information about your restaurant settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate(`/admin/settings/edit/${setting.id}`)}
              className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer font-medium"
            >
              Edit Setting
            </div>
            <div
              onClick={() => navigate("/admin/settings")}
              className="px-6 py-2.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer font-medium"
            >
              Back to List
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-orange-600 mb-4 pb-2 border-b border-orange-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Setting ID
                </label>
                <div className="text-orange-700 font-medium">{setting.id}</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Cafe Name
                </label>
                <div className="text-orange-700 font-medium text-lg">
                  {setting.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Contact Email
                </label>
                <div className="text-orange-700">{setting.contact_email}</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Contact Phone
                </label>
                <div className="text-orange-700">{setting.contact_phone}</div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Address
                </label>
                <div className="text-orange-700">{setting.address}</div>
              </div>

              {setting.opening_hours && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-orange-500 mb-1">
                    Opening Hours
                  </label>
                  <div className="text-orange-700">{setting.opening_hours}</div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-orange-600 mb-4 pb-2 border-b border-orange-200">
              Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Facebook
                </label>
                {setting.facebook_url ? (
                  <a
                    href={setting.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    {setting.facebook_url}
                  </a>
                ) : (
                  <div className="text-orange-400">Not set</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Instagram
                </label>
                {setting.instagram_url ? (
                  <a
                    href={setting.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    {setting.instagram_url}
                  </a>
                ) : (
                  <div className="text-orange-400">Not set</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Twitter
                </label>
                {setting.twitter_url ? (
                  <a
                    href={setting.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    {setting.twitter_url}
                  </a>
                ) : (
                  <div className="text-orange-400">Not set</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  TikTok
                </label>
                {setting.tiktok_url ? (
                  <a
                    href={setting.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    {setting.tiktok_url}
                  </a>
                ) : (
                  <div className="text-orange-400">Not set</div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-orange-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Created At
                </label>
                <div className="text-orange-700 text-sm">
                  {new Date(setting.created_at).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-orange-500 mb-1">
                  Last Updated
                </label>
                <div className="text-orange-700 text-sm">
                  {new Date(setting.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewSetting;
