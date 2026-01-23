import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", id: "home" },
  { name: "Menu", id: "menu" },
  { name: "About", id: "about" },
  { name: "Gallery", id: "gallery" },
  { name: "Reservation", id: "reservation" },
  { name: "Contact", id: "contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
      ${isScrolled
        ? "bg-[#1A120F]/90 backdrop-blur shadow-md py-3"
        : "bg-transparent py-5"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2 text-[#D7B38A] font-semibold text-lg"
        >
          🍽️ The Wooden Plate
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-[#E7D2B6]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="relative group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#D7B38A] group-hover:w-full transition-all" />
            </button>
          ))}
        </div>

        {/* Right buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            to="/login" 
            className="px-4 py-2 rounded-full border border-[#D7B38A]/50 text-[#E7D2B6] hover:bg-[#D7B38A]/10 transition"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 rounded-full bg-[#D7B38A] text-[#1A120F] hover:opacity-90 transition"
          >
            Register
          </Link>
        </div>

        {/* Mobile menu icon */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden text-[#E7D2B6]"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-[#0F0A08] flex flex-col items-center justify-center gap-6 text-[#E7D2B6]
        transition-transform duration-500 md:hidden
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className="absolute top-6 right-6 text-2xl"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>

        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            className="text-lg"
          >
            {link.name}
          </button>
        ))}

        <Link 
          to="/login" 
          className="px-6 py-2 rounded-full border border-[#D7B38A]"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="px-6 py-2 rounded-full bg-[#D7B38A] text-[#1A120F]"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
