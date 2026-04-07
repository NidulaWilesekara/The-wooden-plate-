import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import SettingsForm from "./SettingsForm.jsx";
import { API_BASE, DEFAULT_SETTINGS_FORM, normalizeSettingData } from "./settingsUtils.js";

const EditSetting = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ ...DEFAULT_SETTINGS_FORM });
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${API_BASE}/api/admin/details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const result = await response.json();
        const data = result.data || result;
        setFormData(normalizeSettingData(data));
      } catch (error) {
        toast.error("Failed to load settings");
        navigate("/admin/settings");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchSetting();
    }
  }, [id, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (submitting) return;
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setSubmitting(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${API_BASE}/api/admin/details/${id}`, {
        method: "PUT",
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

        throw new Error(result.message || "Failed to update settings");
      }

      toast.success("Settings updated successfully");
      navigate("/admin/settings");
    } catch (error) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex-1 py-8">
          <div className="w-full md:px-8 px-4">
            <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-600">
              Loading settings...
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SettingsForm
        title="Edit Shop Settings"
        subtitle="Update the business profile customers and admins rely on every day."
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel="Update Settings"
        submittingLabel="Updating..."
        onCancel={() => navigate("/admin/settings")}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmUpdate}
        title="Update Settings"
        message="Are you sure you want to save these settings changes?"
        confirmText="Update"
        cancelText="Cancel"
        type="warning"
      />
    </AdminLayout>
  );
};

export default EditSetting;
