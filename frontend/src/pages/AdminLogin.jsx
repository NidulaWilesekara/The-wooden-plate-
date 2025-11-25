import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/admin/forgot-password");
  };

  return (
    <div className="min-h-screen w-screen flex bg-gray-100">
      {/* LEFT SIDE IMAGE (3/4 on large screens) */}
      <div className="hidden lg:block w-3/4 relative">
        <img
          src="/login.png" // make sure this is in /public
          alt="Admin"
          className="w-full h-full object-cover"
        />
        {/* overlay + text */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12">
          <h1 className="text-4xl font-semibold text-white mb-4">
            Welcome to{" "}
            <span className="text-blue-300">The Wooden Plate</span> Admin Panel
          </h1>
          <p className="text-gray-100 text-sm max-w-md leading-relaxed">
            Securely manage orders, menus, and system settings in one place.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN PANEL */}
      <div className="w-full lg:w-1/4 bg-white flex items-center justify-center">
        <div className="w-full max-w-sm px-8">
          {/* Logo + welcome text */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="/logo.png" // make sure this is in /public
              alt="The Wooden Plate Logo"
              className="w-24 h-24 object-contain"
            />
            <p className="mt-3 text-sm text-gray-500">Welcome back, Admin</p>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">
            Admin Login
          </h2>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="mt-3 w-full py-2 rounded-md border border-black text-sm font-medium text-blue-700 hover:bg-gray-100 transition"
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* FOOTER */}
          <p className="mt-8 text-[11px] text-center text-gray-400">
            © {new Date().getFullYear()} The Wooden Plate. Admin access only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
