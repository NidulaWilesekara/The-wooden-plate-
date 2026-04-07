import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const statCards = [
  {
    key: "unread_messages",
    label: "Unread Messages",
    path: "/admin/contact-messages",
    accent: "amber",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    key: "active_promotions",
    label: "Active Promotions",
    path: "/admin/promotions",
    accent: "blue",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
  },
  {
    key: "menu_items",
    label: "Menu Items",
    path: "/admin/menu-items",
    accent: "emerald",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    key: "products",
    label: "Products",
    path: "/admin/products",
    accent: "violet",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    key: "categories",
    label: "Categories",
    path: "/admin/categories",
    accent: "rose",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    key: "gallery_images",
    label: "Gallery Images",
    path: "/admin/gallery",
    accent: "cyan",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const accentClasses = {
  amber: {
    ring: "ring-amber-200",
    icon: "bg-amber-50 text-amber-600",
  },
  blue: {
    ring: "ring-blue-200",
    icon: "bg-blue-50 text-blue-600",
  },
  emerald: {
    ring: "ring-emerald-200",
    icon: "bg-emerald-50 text-emerald-600",
  },
  violet: {
    ring: "ring-violet-200",
    icon: "bg-violet-50 text-violet-600",
  },
  rose: {
    ring: "ring-rose-200",
    icon: "bg-rose-50 text-rose-600",
  },
  cyan: {
    ring: "ring-cyan-200",
    icon: "bg-cyan-50 text-cyan-600",
  },
};

const alertClasses = {
  danger: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

const checkClasses = {
  ok: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

const formatDateTime = (value) => {
  if (!value) return "Just now";

  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatShortDate = (value) => {
  if (!value) return "No date";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const EmptyState = ({ text }) => (
  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
    {text}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("admin_token");
  const adminUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin_user") || "{}");
    } catch {
      return {};
    }
  })();

  const fetchDashboard = async ({ silent = false } = {}) => {
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/admin/login", { replace: true });
        return;
      }

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to load dashboard");
      }

      setDashboard(result?.data || null);
    } catch (error) {
      toast.error(error.message || "Failed to load dashboard");
      setDashboard(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = dashboard?.stats || {};
  const alerts = dashboard?.alerts || [];
  const checks = dashboard?.checks || [];
  const recentMessages = dashboard?.recent?.messages || [];
  const recentMenuItems = dashboard?.recent?.menu_items || [];
  const recentPromotions = dashboard?.recent?.promotions || [];

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="w-full md:px-8 px-4 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                  Admin Dashboard
                </p>
                <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                  Welcome back{adminUser?.name ? `, ${adminUser.name}` : ""}.
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-600 md:text-base">
                  Here is the current snapshot of your site content, pending admin
                  actions, and the latest updates from customers.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  Last updated:{" "}
                  <span className="font-semibold text-gray-900">
                    {formatDateTime(dashboard?.generated_at)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => fetchDashboard({ silent: true })}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-white"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {statCards.map((card) => {
                  const item = stats[card.key] || { value: 0, note: "No data yet" };
                  const accent = accentClasses[card.accent];

                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() => navigate(card.path)}
                      className={`rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {card.label}
                          </p>
                          <p className="mt-4 text-3xl font-bold text-gray-900">
                            {item.value}
                          </p>
                          <p className="mt-2 text-sm text-gray-600">{item.note}</p>
                        </div>

                        <div className={`rounded-2xl p-3 ${accent.icon}`}>
                          {card.icon}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Attention Needed
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Things worth checking today.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 p-6">
                      {alerts.length === 0 ? (
                        <EmptyState text="Everything looks calm right now. No urgent issues detected." />
                      ) : (
                        alerts.map((alert, index) => (
                          <div
                            key={`${alert.title}-${index}`}
                            className={`rounded-2xl border p-4 ${alertClasses[alert.level] || alertClasses.info}`}
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <p className="text-sm font-semibold">{alert.title}</p>
                                <p className="mt-1 text-sm opacity-90">
                                  {alert.description}
                                </p>
                              </div>

                              {alert.path && (
                                <button
                                  type="button"
                                  onClick={() => navigate(alert.path)}
                                  className="inline-flex items-center justify-center rounded-xl border border-current px-4 py-2 text-sm font-medium transition hover:bg-white/50"
                                >
                                  {alert.action_label || "Open"}
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Site Health
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Quick checks for customer-facing content readiness.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 p-6">
                      {checks.map((check) => (
                        <div
                          key={check.label}
                          className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-medium text-gray-900">
                                {check.label}
                              </p>
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${checkClasses[check.status] || checkClasses.warning}`}
                              >
                                {check.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              {check.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => navigate(check.path)}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                          >
                            Manage
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Latest Messages
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Most recent customer inquiries.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/admin/contact-messages")}
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-3 p-6">
                    {recentMessages.length === 0 ? (
                      <EmptyState text="No customer messages yet." />
                    ) : (
                      recentMessages.map((message) => (
                        <button
                          key={message.id}
                          type="button"
                          onClick={() => navigate(`/admin/contact-messages/${message.id}`)}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-gray-900">{message.name}</p>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                message.is_read
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {message.is_read ? "Read" : "Unread"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{message.email}</p>
                          <p className="mt-3 text-sm text-gray-600">{message.excerpt}</p>
                          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                            {formatDateTime(message.created_at)}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Recent Menu Items
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Newly added dishes and their status.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/admin/menu-items")}
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-3 p-6">
                    {recentMenuItems.length === 0 ? (
                      <EmptyState text="No menu items yet." />
                    ) : (
                      recentMenuItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigate(`/admin/menu-items/${item.id}`)}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.category || "Uncategorized"}
                              </p>
                            </div>

                            <div className="flex flex-wrap justify-end gap-2">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  item.is_available
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {item.is_available ? "Available" : "Hidden"}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  item.is_popular
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {item.is_popular ? "Popular" : "Standard"}
                              </span>
                            </div>
                          </div>
                          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                            Added {formatDateTime(item.created_at)}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Recent Promotions
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Latest offers and expiry dates.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/admin/promotions")}
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-3 p-6">
                    {recentPromotions.length === 0 ? (
                      <EmptyState text="No promotions created yet." />
                    ) : (
                      recentPromotions.map((promotion) => (
                        <button
                          key={promotion.id}
                          type="button"
                          onClick={() => navigate(`/admin/promotions/view/${promotion.id}`)}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-gray-900">
                              {promotion.title}
                            </p>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                promotion.is_active
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {promotion.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <p className="mt-3 text-sm text-gray-600">
                            {promotion.ends_at
                              ? `Ends on ${formatShortDate(promotion.ends_at)}`
                              : "No expiry date"}
                          </p>

                          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                            Created {formatDateTime(promotion.created_at)}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
