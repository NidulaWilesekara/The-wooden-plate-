import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("admin_user");
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch {
        setAdminUser({});
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login", { replace: true });
  };

  const handleViewProfile = () => {
    navigate("/admin/profile");
  };

  return (

    <header className="h-20 bg-white border-b border-gray-200 flex items-center px-6 md:px-10 shadow-sm">
      {/* LEFT: animated brand name */}
      <div className="flex items-center gap-3">
        <h1
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer"
          style={{
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'shimmer 2.5s linear infinite',
          }}
        >
          The Wooden Plate
        </h1>
      </div>

      {/* CENTER: empty for now */}
      <div className="flex-1" />

      {/* RIGHT: notification + profile (same flex, big gap) */}
      <div className="flex items-center gap-8">
        {/* notification */}
        <div className="relative p-2 rounded-full hover:bg-orange-50 transition">
          <svg
            className="w-6 h-6 text-orange-500"
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
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </div>

        {/* profile */}
        <div className="relative">
          <div
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-sm font-medium text-white cursor-pointer transition"
          >
            <span>Profile</span>
          </div>

          {open && (
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
  );
};

export default AdminNavbar;

// Add shimmer animation keyframes
const style = document.createElement('style');
style.innerHTML = `
@keyframes shimmer {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}`;
if (!document.head.querySelector('style[data-admin-navbar-shimmer]')) {
  style.setAttribute('data-admin-navbar-shimmer', '');
  document.head.appendChild(style);
}
