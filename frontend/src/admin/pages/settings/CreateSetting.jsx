import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const CreateSetting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Preset options for opening hours
  const OPENING_PRESETS = useMemo(
    () => [
      { value: "", label: "Select Opening Hours" },
      { value: "Mon-Sun: 10:00 AM - 10:00 PM", label: "Mon-Sun: 10:00 AM - 10:00 PM" },
      { value: "Mon-Fri: 9:00 AM - 9:00 PM", label: "Mon-Fri: 9:00 AM - 9:00 PM" },
      { value: "Mon-Sat: 10:00 AM - 10:00 PM", label: "Mon-Sat: 10:00 AM - 10:00 PM" },
      { value: "Fri-Sun: 11:00 AM - 11:00 PM", label: "Fri-Sun: 11:00 AM - 11:00 PM" },
      { value: "24/7", label: "24/7 (Open all day)" },
      { value: "custom", label: "Custom..." },
    ],
    []
  );

  const [openingMode, setOpeningMode] = useState(""); // "" | preset value | "custom"
  const [customOpeningHours, setCustomOpeningHours] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    opening_hours: "", // ✅ will be set by dropdown/custom
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    tiktok_url: "",
  });

  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Opening hours dropdown handler
  const handleOpeningSelect = (e) => {
    const selected = e.target.value;
    setOpeningMode(selected);

    if (selected === "custom") {
      // user will type custom text
      setFormData((p) => ({ ...p, opening_hours: "" }));
      setCustomOpeningHours("");
    } else {
      // preset selected
      setFormData((p) => ({ ...p, opening_hours: selected }));
      setCustomOpeningHours("");
    }
  };

  // ✅ Custom hours input handler
  const handleCustomOpeningHours = (e) => {
    const val = e.target.value;
    setCustomOpeningHours(val);
    setFormData((p) => ({ ...p, opening_hours: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("http://localhost:8000/api/admin/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create setting");
      }

      toast.success("Setting created successfully!");
      navigate("/admin/settings");
    } catch (error) {
      toast.error(error.message || "Failed to create setting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create Shop Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your restaurant details and information
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cafe Name */}
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

                {/* Contact Email */}
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

                {/* Contact Phone */}
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

                {/* ✅ Opening Hours (Dropdown + Custom) */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Opening Hours
                  </label>

                  <select
                    value={openingMode}
                    onChange={handleOpeningSelect}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    {OPENING_PRESETS.map((o) => (
                      <option key={o.value || "empty"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>

                  {/* Custom input (only if "custom" selected) */}
                  {openingMode === "custom" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={customOpeningHours}
                        onChange={handleCustomOpeningHours}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                        placeholder="e.g. Mon-Fri: 9:00 AM - 5:00 PM"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Tip: Use a clear format like <span className="font-medium">Mon-Sun: 10:00 AM - 10:00 PM</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Address */}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating..." : "Create Setting"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/settings")}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>

            {/* Hidden debug (optional)
              <pre className="mt-6 text-xs text-gray-500">{JSON.stringify(formData, null, 2)}</pre>
            */}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateSetting;
