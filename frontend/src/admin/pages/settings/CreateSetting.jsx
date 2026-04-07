import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import SettingsForm from "./SettingsForm.jsx";
import { API_BASE, DEFAULT_SETTINGS_FORM } from "./settingsUtils.js";

const CreateSetting = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...DEFAULT_SETTINGS_FORM });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${API_BASE}/api/admin/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result.errors) {
          Object.values(result.errors)
            .flat()
            .forEach((message) => toast.error(message));
          return;
        }

        throw new Error(result.message || "Failed to create settings");
      }

      toast.success("Settings created successfully");
      navigate("/admin/settings");
    } catch (error) {
      toast.error(error.message || "Failed to create settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <SettingsForm
        title="Create Shop Settings"
        subtitle="Set up your restaurant profile, customer contact details, and online presence."
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Settings"
        submittingLabel="Creating..."
        onCancel={() => navigate("/admin/settings")}
      />
    </AdminLayout>
  );
};

export default CreateSetting;
