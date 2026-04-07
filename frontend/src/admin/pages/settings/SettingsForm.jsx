import React, { useEffect, useState } from "react";
import {
  OPENING_PRESETS,
  SOCIAL_FIELDS,
  getOpeningModeFromValue,
  getSettingsCompletion,
  getSettingsMissingFields,
} from "./settingsUtils.js";

const SettingsForm = ({
  title,
  subtitle,
  formData,
  setFormData,
  onSubmit,
  loading,
  submitLabel,
  submittingLabel,
  onCancel,
  cancelLabel = "Cancel",
}) => {
  const [openingMode, setOpeningMode] = useState(
    getOpeningModeFromValue(formData.opening_hours)
  );
  const [customOpeningHours, setCustomOpeningHours] = useState(
    getOpeningModeFromValue(formData.opening_hours) === "custom"
      ? formData.opening_hours
      : ""
  );

  const completion = getSettingsCompletion(formData);
  const missingFields = getSettingsMissingFields(formData);
  const socialLinksConnected = SOCIAL_FIELDS.filter(
    ({ key }) => Boolean(formData[key])
  ).length;

  useEffect(() => {
    const nextMode = getOpeningModeFromValue(formData.opening_hours);
    setOpeningMode(nextMode);
    setCustomOpeningHours(nextMode === "custom" ? formData.opening_hours : "");
  }, [formData.opening_hours]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleOpeningSelect = (event) => {
    const selected = event.target.value;
    setOpeningMode(selected);

    if (selected === "custom") {
      setCustomOpeningHours("");
      setFormData((previous) => ({
        ...previous,
        opening_hours: "",
      }));
      return;
    }

    setCustomOpeningHours("");
    setFormData((previous) => ({
      ...previous,
      opening_hours: selected,
    }));
  };

  const handleCustomOpeningHours = (event) => {
    const value = event.target.value;
    setCustomOpeningHours(value);
    setFormData((previous) => ({
      ...previous,
      opening_hours: value,
    }));
  };

  return (
    <div className="flex-1 py-8">
      <div className="w-full md:px-8 px-4">
        <div className="mb-6">
          <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-6 py-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              </div>

              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                           bg-white hover:bg-gray-50 border border-gray-200
                           text-gray-800 text-sm font-medium transition cursor-pointer"
              >
                Back to Settings
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_340px] gap-6">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Business Profile
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Keep your restaurant identity and contact information accurate.
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="The Wooden Plate"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    placeholder="info@woodenplate.com"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    placeholder="+94 77 123 4567"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Opening Hours <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={openingMode}
                    onChange={handleOpeningSelect}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {OPENING_PRESETS.map((option) => (
                      <option key={option.value || "empty"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {openingMode === "custom" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={customOpeningHours}
                        onChange={handleCustomOpeningHours}
                        placeholder="e.g. Mon-Fri: 8:00 AM - 10:00 PM"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Use a customer-friendly schedule format.
                      </p>
                    </div>
                  )}
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
                    rows={3}
                    placeholder="123 Main Street, Colombo, Sri Lanka"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Online Presence
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Link the social platforms customers are most likely to visit.
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {SOCIAL_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="url"
                      name={field.key}
                      value={formData[field.key]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Readiness
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  A quick check before you save changes.
                </p>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-500">Completion</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {completion}%
                </p>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>

                <div className="mt-5 space-y-2">
                  {missingFields.length === 0 ? (
                    <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      All core business details are filled and ready.
                    </div>
                  ) : (
                    missingFields.map((field) => (
                      <div
                        key={field}
                        className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700"
                      >
                        Missing: {field}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Customer Experience Notes
                </h2>
              </div>

              <div className="p-6 space-y-4 text-sm text-gray-600">
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  Customers look for your phone number, address, and hours first.
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  Social links connected:{" "}
                  <span className="font-semibold text-gray-900">
                    {socialLinksConnected} / {SOCIAL_FIELDS.length}
                  </span>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  Keep business name formatting consistent with your branding.
                </div>
              </div>
            </section>
          </div>

          <div className="xl:col-span-2 flex flex-col md:flex-row gap-3 pt-2 md:justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`rounded-md cursor-pointer px-5 py-2.5 text-sm font-medium transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? submittingLabel : submitLabel}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-5 py-2.5 text-sm font-medium
                        bg-gray-100 hover:bg-gray-200 border border-gray-200
                        text-gray-800 transition cursor-pointer"
            >
              {cancelLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
