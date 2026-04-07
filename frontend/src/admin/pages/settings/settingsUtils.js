export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const DEFAULT_SETTINGS_FORM = {
  name: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  opening_hours: "",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
};

export const OPENING_PRESETS = [
  { value: "", label: "Select opening hours" },
  {
    value: "Mon-Sun: 10:00 AM - 10:00 PM",
    label: "Mon-Sun: 10:00 AM - 10:00 PM",
  },
  {
    value: "Mon-Fri: 9:00 AM - 9:00 PM",
    label: "Mon-Fri: 9:00 AM - 9:00 PM",
  },
  {
    value: "Mon-Sat: 10:00 AM - 10:00 PM",
    label: "Mon-Sat: 10:00 AM - 10:00 PM",
  },
  {
    value: "Fri-Sun: 11:00 AM - 11:00 PM",
    label: "Fri-Sun: 11:00 AM - 11:00 PM",
  },
  {
    value: "24/7",
    label: "24/7 (always open)",
  },
  {
    value: "custom",
    label: "Custom schedule",
  },
];

export const SOCIAL_FIELDS = [
  {
    key: "facebook_url",
    label: "Facebook",
    placeholder: "https://facebook.com/yourpage",
    type: "facebook",
    iconClasses: "bg-blue-50 text-blue-600 ring-blue-100",
  },
  {
    key: "instagram_url",
    label: "Instagram",
    placeholder: "https://instagram.com/yourpage",
    type: "instagram",
    iconClasses: "bg-pink-50 text-pink-600 ring-pink-100",
  },
  {
    key: "twitter_url",
    label: "X / Twitter",
    placeholder: "https://x.com/yourpage",
    type: "twitter",
    iconClasses: "bg-slate-100 text-slate-800 ring-slate-200",
  },
  {
    key: "tiktok_url",
    label: "TikTok",
    placeholder: "https://tiktok.com/@yourpage",
    type: "tiktok",
    iconClasses: "bg-gray-100 text-gray-900 ring-gray-200",
  },
];

export const REQUIRED_SETTINGS_FIELDS = [
  { key: "name", label: "Business name" },
  { key: "contact_email", label: "Contact email" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "address", label: "Address" },
  { key: "opening_hours", label: "Opening hours" },
];

export const normalizeSettingData = (value = {}) => ({
  ...DEFAULT_SETTINGS_FORM,
  name: value.name || "",
  contact_email: value.contact_email || "",
  contact_phone: value.contact_phone || "",
  address: value.address || "",
  opening_hours: value.opening_hours || "",
  facebook_url: value.facebook_url || "",
  instagram_url: value.instagram_url || "",
  twitter_url: value.twitter_url || "",
  tiktok_url: value.tiktok_url || "",
});

export const getDisplayBusinessName = (settings = {}) =>
  settings.name ||
  settings.cafe_name ||
  settings.shop_name ||
  settings.title ||
  "Your Business";

export const getSettingsMissingFields = (settings = {}) =>
  REQUIRED_SETTINGS_FIELDS.filter(({ key }) => !String(settings[key] || "").trim()).map(
    ({ label }) => label
  );

export const getSettingsCompletion = (settings = {}) => {
  const missing = getSettingsMissingFields(settings);
  return Math.round(
    ((REQUIRED_SETTINGS_FIELDS.length - missing.length) /
      REQUIRED_SETTINGS_FIELDS.length) *
      100
  );
};

export const getConnectedSocialCount = (settings = {}) =>
  SOCIAL_FIELDS.filter(({ key }) => Boolean(settings[key])).length;

export const getPrimarySettingsRecord = (settings = []) => {
  if (!Array.isArray(settings) || settings.length === 0) return null;

  return [...settings].sort((left, right) => {
    const leftTime = new Date(left.updated_at || left.created_at || 0).getTime();
    const rightTime = new Date(right.updated_at || right.created_at || 0).getTime();

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return (right.id || 0) - (left.id || 0);
  })[0];
};

export const getOpeningModeFromValue = (value) => {
  if (!value) return "";

  const isPreset = OPENING_PRESETS.some(
    (preset) => preset.value && preset.value !== "custom" && preset.value === value
  );

  return isPreset ? value : "custom";
};
