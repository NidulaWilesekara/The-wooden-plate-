import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const alertStyles = {
  danger: {
    card: "border-red-200 bg-red-50",
    badge: "bg-red-100 text-red-700",
  },
  warning: {
    card: "border-amber-200 bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
  },
  info: {
    card: "border-blue-200 bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
  },
};

const formatRelativeTime = (value) => {
  if (!value) return "Just now";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const AdminNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({});
  const [notifications, setNotifications] = useState(null);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [refreshingNotifications, setRefreshingNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("admin_token");

  const fetchNotifications = async ({ silent = false } = {}) => {
    if (!token) return;

    try {
      if (silent) {
        setRefreshingNotifications(true);
      } else {
        setLoadingNotifications(true);
      }

      const response = await fetch(`${API_BASE}/api/admin/notifications`, {
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
        throw new Error(result?.message || "Failed to load notifications");
      }

      setNotifications(result?.data || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNotifications(false);
      setRefreshingNotifications(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("admin_user");
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch {
        setAdminUser({});
      }
    }

    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    const intervalId = window.setInterval(() => {
      fetchNotifications({ silent: true });
    }, 60000);

    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login", { replace: true });
  };

  const handleViewProfile = () => {
    navigate("/admin/profile");
  };

  const handleOpenNotifications = () => {
    setIsProfileOpen(false);
    setIsNotificationsOpen(true);
    fetchNotifications({ silent: true });
  };

  const handleNavigateFromNotification = (path) => {
    setIsNotificationsOpen(false);
    navigate(path);
  };

  const attentionCount = notifications?.summary?.attention_count || 0;
  const unreadMessages = notifications?.summary?.unread_messages || 0;
  const alertCount = notifications?.summary?.alert_count || 0;
  const alerts = notifications?.alerts || [];
  const messages = notifications?.messages || [];

  return (
    <>
      <header className="h-20 bg-white border-b border-gray-200 flex items-center px-6 md:px-10 shadow-sm">
        <div className="flex items-center gap-3">
          <h1
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer"
            style={{
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              animation: "shimmer 2.5s linear infinite",
            }}
          >
            The Wooden Plate
          </h1>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleOpenNotifications}
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-500 transition hover:bg-orange-100"
            aria-label="Open notifications"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {attentionCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-sm">
                {attentionCount > 99 ? "99+" : attentionCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(false);
                setIsProfileOpen((value) => !value);
              }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-sm font-medium text-white cursor-pointer transition"
            >
              <span>Profile</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md text-sm z-20">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {adminUser?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {adminUser?.email || "admin@woodenplate.com"}
                  </p>
                </div>

                <div
                  onClick={handleViewProfile}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer"
                >
                  View Profile
                </div>

                <div
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-b-lg cursor-pointer"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {isNotificationsOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[1px]"
            onClick={() => setIsNotificationsOpen(false)}
          />

          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl">
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Notifications
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    Admin updates
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Review alerts, unread inquiries, and latest attention items.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100"
                  aria-label="Close notifications"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Attention
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {attentionCount}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Pending action items
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Inbox
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {unreadMessages}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Unread customer messages
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {notifications?.generated_at
                    ? `Updated ${formatRelativeTime(notifications.generated_at)}`
                    : "Waiting for notification data"}
                </p>

                <button
                  type="button"
                  onClick={() => fetchNotifications({ silent: true })}
                  disabled={refreshingNotifications}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {refreshingNotifications ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {loadingNotifications ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Alerts
                        </h3>
                        <p className="text-sm text-gray-500">
                          {alertCount > 0
                            ? `${alertCount} alert${alertCount === 1 ? "" : "s"} available`
                            : "No urgent alerts right now"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {alerts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                          Everything looks under control.
                        </div>
                      ) : (
                        alerts.map((alert, index) => {
                          const styles = alertStyles[alert.level] || alertStyles.info;

                          return (
                            <button
                              key={`${alert.kind}-${index}`}
                              type="button"
                              onClick={() => handleNavigateFromNotification(alert.path)}
                              className={`w-full rounded-2xl border p-4 text-left transition hover:shadow-sm ${styles.card}`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
                                >
                                  {alert.level}
                                </span>
                                <span className="text-xs font-medium text-gray-500">
                                  {alert.action_label || "Open"}
                                </span>
                              </div>

                              <p className="mt-3 text-sm font-semibold text-gray-900">
                                {alert.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-600">
                                {alert.description}
                              </p>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </section>

                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Inbox Preview
                        </h3>
                        <p className="text-sm text-gray-500">
                          Latest contact activity from customers.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {messages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                          No message activity yet.
                        </div>
                      ) : (
                        messages.map((message) => (
                          <button
                            key={message.id}
                            type="button"
                            onClick={() => handleNavigateFromNotification(message.path)}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900">
                                    {message.name}
                                  </p>
                                  {!message.is_read && (
                                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {message.email}
                                </p>
                              </div>

                              <span className="text-xs font-medium text-gray-400">
                                {formatRelativeTime(message.created_at)}
                              </span>
                            </div>

                            <p className="mt-3 text-sm text-gray-600">
                              {message.excerpt}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleNavigateFromNotification("/admin/dashboard")}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Open Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateFromNotification("/admin/contact-messages")}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  View Messages
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default AdminNavbar;

const style = document.createElement("style");
style.innerHTML = `
@keyframes shimmer {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}`;
if (!document.head.querySelector("style[data-admin-navbar-shimmer]")) {
  style.setAttribute("data-admin-navbar-shimmer", "");
  document.head.appendChild(style);
}
