import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0F0A08] text-[#E7D2B6] pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-[#C98A5A]">The Wooden Plate</h3>
            <p className="mt-3 text-sm text-[#BFA58A] leading-relaxed">
              A cozy place to enjoy fresh burgers, drinks, and warm vibes.
              Taste the best handcrafted food in town.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {/* Facebook */}
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#8B5A2B]/50 bg-black/20
                           flex items-center justify-center hover:bg-[#C98A5A] hover:text-[#0F0A08]
                           transition"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.8C10.5 7.3 12 6 14.3 6c1.1 0 2.2.2 2.2.2v2.4H15.3c-1.2 0-1.6.7-1.6 1.5V12H16.4l-.4 3h-2.3v7A10 10 0 0022 12z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#8B5A2B]/50 bg-black/20
                           flex items-center justify-center hover:bg-[#C98A5A] hover:text-[#0F0A08]
                           transition"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 4a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#8B5A2B]/50 bg-black/20
                           flex items-center justify-center hover:bg-[#C98A5A] hover:text-[#0F0A08]
                           transition"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.6 6.2c1.1 1 2.5 1.6 4 1.7v3.1c-1.7-.1-3.3-.7-4.6-1.7v7.1c0 3.1-2.5 5.6-5.6 5.6S5 19.5 5 16.4s2.5-5.6 5.6-5.6c.5 0 1 .1 1.5.2v3.2c-.5-.2-1-.3-1.5-.3-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5V2h3.1c.1 1.6.7 3 1.9 4.2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[#C98A5A]">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#BFA58A]">
              <li><Link to="/" className="hover:text-[#E7D2B6] transition">Home</Link></li>
              <li><Link to="/menu" className="hover:text-[#E7D2B6] transition">Menu</Link></li>
              <li><Link to="/about" className="hover:text-[#E7D2B6] transition">About</Link></li>
              <li><Link to="/gallery" className="hover:text-[#E7D2B6] transition">Gallery</Link></li>
              <li><Link to="/reservation" className="hover:text-[#E7D2B6] transition">Reservation</Link></li>
              <li><Link to="/contact" className="hover:text-[#E7D2B6] transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-[#C98A5A]">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-[#BFA58A]">
              <li>
                <span className="text-[#E7D2B6] font-medium">Address:</span>{" "}
                123 Main Street, Colombo, Sri Lanka
              </li>
              <li>
                <span className="text-[#E7D2B6] font-medium">Phone:</span>{" "}
                +94 77 123 4567
              </li>
              <li>
                <span className="text-[#E7D2B6] font-medium">Email:</span>{" "}
                info@woodenplate.com
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-semibold text-[#C98A5A]">Opening Hours</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#BFA58A]">
              <li>
                <span className="text-[#E7D2B6] font-medium">Mon - Fri:</span>{" "}
                10:00 AM - 10:00 PM
              </li>
              <li>
                <span className="text-[#E7D2B6] font-medium">Sat - Sun:</span>{" "}
                11:00 AM - 11:30 PM
              </li>
              <li className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full border border-[#C98A5A]/50 bg-black/20 text-xs">
                  Kitchen closes 30 mins early
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#8B5A2B]/30 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#BFA58A]">
            © {new Date().getFullYear()} The Wooden Plate. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs text-[#BFA58A]">
            <a href="#" className="hover:text-[#E7D2B6] transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#E7D2B6] transition">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
