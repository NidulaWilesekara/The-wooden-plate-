import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";

const EditSetting = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    opening_hours: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    tiktok_url: "",
  });

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
        const data = result.data || result;
        setFormData({
          name: data.name || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          address: data.address || "",
          opening_hours: data.opening_hours || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
          twitter_url: data.twitter_url || "",
          tiktok_url: data.tiktok_url || "",
        });
      } catch (error) {
        toast.error("Failed to load setting");
        navigate("/admin/settings");
      } finally {
        setFetching(false);
      }
    };

    fetchSetting();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `http://localhost:8000/api/admin/details/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update setting");
      }

      toast.success("Setting updated successfully");
      navigate("/admin/settings");
    } catch (error) {
      toast.error(error.message || "Failed to update setting");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-orange-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Edit Shop Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your restaurant details and information
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Cafe Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="The Wooden Plate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="info@woodenplate.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="+94 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    name="opening_hours"
                    value={formData.opening_hours}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="Mon-Sun: 10:00 AM - 10:00 PM"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="123 Main Street, Colombo, Sri Lanka"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    name="tiktok_url"
                    value={formData.tiktok_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    placeholder="https://tiktok.com/@yourpage"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-medium"
              >
                {loading ? "Updating..." : "Update Setting"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/settings")}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmUpdate}
        title="Update Settings"
        message="Are you sure you want to update these settings?"
        confirmText="Update"
        cancelText="Cancel"
        type="warning"
      />
    </AdminLayout>
  );
};

export default EditSetting;
