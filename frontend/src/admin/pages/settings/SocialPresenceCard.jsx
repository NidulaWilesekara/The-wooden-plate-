import React from "react";

export const SocialPlatformIcon = ({ type, className = "h-5 w-5" }) => {
  if (type === "facebook") {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.8C10.5 7.3 12 6 14.3 6c1.1 0 2.2.2 2.2.2v2.4H15.3c-1.2 0-1.6.7-1.6 1.5V12H16.4l-.4 3h-2.3v7A10 10 0 0022 12z" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 4a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" />
      </svg>
    );
  }

  if (type === "twitter") {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.73L6.18 22H3.06l7.24-8.28L2 2h6.4l4.42 6.08L18.9 2zm-1.09 18h1.73L7.46 3.9H5.61z" />
      </svg>
    );
  }

  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.6 6.2c1.1 1 2.5 1.6 4 1.7v3.1c-1.7-.1-3.3-.7-4.6-1.7v7.1c0 3.1-2.5 5.6-5.6 5.6S5 19.5 5 16.4s2.5-5.6 5.6-5.6c.5 0 1 .1 1.5.2v3.2c-.5-.2-1-.3-1.5-.3-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5V2h3.1c.1 1.6.7 3 1.9 4.2z" />
    </svg>
  );
};

const SocialPresenceCard = ({ field, value }) => {
  const isConnected = Boolean(value);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              title={`Open ${field.label}`}
              aria-label={`Open ${field.label}`}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition hover:-translate-y-0.5 hover:shadow-sm ${field.iconClasses}`}
            >
              <SocialPlatformIcon type={field.type} className="h-5 w-5" />
            </a>
          ) : (
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 opacity-45 ${field.iconClasses}`}
            >
              <SocialPlatformIcon type={field.type} className="h-5 w-5" />
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-900">{field.label}</p>
            <p className="mt-1 text-xs text-gray-500">
              {isConnected ? "Tap the icon to open" : "Not connected"}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
            isConnected
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-white text-gray-400 ring-gray-200"
          }`}
        >
          {isConnected ? "Connected" : "Inactive"}
        </span>
      </div>
    </div>
  );
};

export default SocialPresenceCard;
