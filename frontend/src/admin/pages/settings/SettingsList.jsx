import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import {
  API_BASE,
  SOCIAL_FIELDS,
  getDisplayBusinessName,
  getPrimarySettingsRecord,
} from "./settingsUtils.js";
import SocialPresenceCard from "./SocialPresenceCard.jsx";

const SettingsList = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${API_BASE}/api/admin/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const result = await response.json();
        setSettings(result.data || []);
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const currentSetting = useMemo(
    () => getPrimarySettingsRecord(settings),
    [settings]
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex-1 py-8">
          <div className="w-full md:px-8 px-4 space-y-6">
            <div className="h-28 rounded-xl border border-gray-200 bg-white animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-2xl border border-gray-200 bg-white animate-pulse"
                />
              ))}
            </div>
            <div className="h-96 rounded-2xl border border-gray-200 bg-white animate-pulse" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="w-full md:px-8 px-4 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-gray-100 px-6 py-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Shop Settings
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage the business profile customers see across your website.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {currentSetting ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/settings/edit/${currentSetting.id}`)}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                               bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition cursor-pointer"
                  >
                    Edit Settings
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/admin/settings/create")}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                               bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition cursor-pointer"
                  >
                    Create Settings
                  </button>
                )}
              </div>
            </div>
          </div>

          {!currentSetting ? (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  No business profile yet
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add your core restaurant details to complete the admin setup.
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_320px] gap-6">
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Start with the essentials
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Your business profile should include the restaurant name,
                    customer email, phone number, address, opening hours, and
                    social links.
                  </p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Business name",
                      "Contact email",
                      "Contact phone",
                      "Address",
                      "Opening hours",
                      "Social links",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Why this matters
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-gray-600">
                    <div className="rounded-xl bg-gray-50 px-4 py-3">
                      Customers use these details before contacting or visiting.
                    </div>
                    <div className="rounded-xl bg-gray-50 px-4 py-3">
                      The dashboard and notifications depend on profile readiness.
                    </div>
                    <div className="rounded-xl bg-gray-50 px-4 py-3">
                      Complete settings make the site feel trustworthy and polished.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/settings/create")}
                    className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Add Business Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {settings.length > 1 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                  {settings.length} settings records were found. This page is
                  showing the most recently updated profile.
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_320px] gap-6">
                <div className="space-y-6">
                  <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Business Profile
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Core identity and operating information used across the site.
                      </p>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DetailBlock
                        label="Business Name"
                        value={getDisplayBusinessName(currentSetting)}
                        strong
                      />
                      <DetailBlock
                        label="Opening Hours"
                        value={currentSetting.opening_hours || "Not set"}
                      />
                      <DetailBlock
                        label="Contact Email"
                        value={currentSetting.contact_email || "Not set"}
                      />
                      <DetailBlock
                        label="Contact Phone"
                        value={currentSetting.contact_phone || "Not set"}
                      />
                      <DetailBlock
                        label="Address"
                        value={currentSetting.address || "Not set"}
                        full
                      />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Online Presence
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Public links customers can use to discover your brand.
                      </p>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SOCIAL_FIELDS.map((field) => (
                        <SocialPresenceCard
                          key={field.key}
                          field={field}
                          value={currentSetting[field.key]}
                        />
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Quick Actions
                      </h2>
                    </div>

                    <div className="p-6 space-y-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/settings/edit/${currentSetting.id}`)}
                        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        Edit Settings
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate("/admin/dashboard")}
                        className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const DetailBlock = ({ label, value, strong = false, full = false }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p
      className={`mt-2 break-words text-sm ${
        strong ? "font-semibold text-gray-900 text-xl" : "text-gray-700"
      }`}
    >
      {value}
    </p>
  </div>
);

export default SettingsList;
