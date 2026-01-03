import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';

const CustomerLayout = ({ children }) => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { customer, logout, isAuthenticated } = useCustomerAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cartCount = getCartCount();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-amber-600">🍽️ The Wooden Plate</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/') ? 'text-amber-600 font-semibold' : 'text-gray-700'
                } hover:text-amber-600 transition`}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className={`${
                  isActive('/menu') ? 'text-amber-600 font-semibold' : 'text-gray-700'
                } hover:text-amber-600 transition`}
              >
                Menu
              </Link>
              <Link
                to="/about"
                className={`${
                  isActive('/about') ? 'text-amber-600 font-semibold' : 'text-gray-700'
                } hover:text-amber-600 transition`}
              >
                About
              </Link>

              {/* User Menu or Login */}
              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition"
                  >
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-semibold">
                        {customer?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{customer?.name?.split(' ')[0]}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/my-orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-600 transition"
                >
                  Login
                </Link>
              )}

              <Link
                to="/cart"
                className="relative bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Link
                to="/cart"
                className="relative bg-amber-600 text-white p-2 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex justify-around py-2">
            <Link to="/" className={`px-3 py-2 ${isActive('/') ? 'text-amber-600' : 'text-gray-600'}`}>
              Home
            </Link>
            <Link to="/menu" className={`px-3 py-2 ${isActive('/menu') ? 'text-amber-600' : 'text-gray-600'}`}>
              Menu
            </Link>
            <Link to="/about" className={`px-3 py-2 ${isActive('/about') ? 'text-amber-600' : 'text-gray-600'}`}>
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold text-amber-500 mb-4">The Wooden Plate</h3>
              <p className="text-gray-400">
                Serving delicious meals with love and care. Experience authentic flavors in a cozy atmosphere.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold text-amber-500 mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +94 77 123 4567</li>
                <li>📧 info@thewoodenplate.lk</li>
                <li>📍 123 Main Street, Colombo</li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-xl font-bold text-amber-500 mb-4">Opening Hours</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Monday - Friday: 10:00 AM - 10:00 PM</li>
                <li>Saturday - Sunday: 9:00 AM - 11:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 The Wooden Plate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
