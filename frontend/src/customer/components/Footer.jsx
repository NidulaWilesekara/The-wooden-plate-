import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const FALLBACK_DETAILS = {
  name: "The Wooden Plate",
  contact_email: "",
  contact_phone: "",
  address: "",
  opening_hours: "",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
};

const normalizeText = (value) => String(value || "").trim();

const normalizeDetails = (value = {}) => ({
  name: normalizeText(value.name) || FALLBACK_DETAILS.name,
  contact_email: normalizeText(value.contact_email),
  contact_phone: normalizeText(value.contact_phone),
  address: normalizeText(value.address),
  opening_hours: normalizeText(value.opening_hours),
  facebook_url: normalizeText(value.facebook_url),
  instagram_url: normalizeText(value.instagram_url),
  twitter_url: normalizeText(value.twitter_url),
  tiktok_url: normalizeText(value.tiktok_url),
});

const socialButtonClass =
  "w-10 h-10 rounded-full border border-[#8B5A2B]/50 bg-black/20 flex items-center justify-center hover:bg-[#C98A5A] hover:text-[#0F0A08] transition";

const SocialIcon = ({ type }) => {
  if (type === "facebook") {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.8C10.5 7.3 12 6 14.3 6c1.1 0 2.2.2 2.2.2v2.4H15.3c-1.2 0-1.6.7-1.6 1.5V12H16.4l-.4 3h-2.3v7A10 10 0 0022 12z" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 4a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" />
      </svg>
    );
  }

  if (type === "twitter") {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.73L6.18 22H3.06l7.24-8.28L2 2h6.4l4.42 6.08L18.9 2zm-1.09 18h1.73L7.46 3.9H5.61z" />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.6 6.2c1.1 1 2.5 1.6 4 1.7v3.1c-1.7-.1-3.3-.7-4.6-1.7v7.1c0 3.1-2.5 5.6-5.6 5.6S5 19.5 5 16.4s2.5-5.6 5.6-5.6c.5 0 1 .1 1.5.2v3.2c-.5-.2-1-.3-1.5-.3-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5V2h3.1c.1 1.6.7 3 1.9 4.2z" />
    </svg>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState(FALLBACK_DETAILS);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDetails = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/public/details`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data?.data) {
          return;
        }

        setDetails(normalizeDetails(data.data));
      } catch (error) {
        if (error.name !== "AbortError") {
          setDetails(FALLBACK_DETAILS);
        }
      }
    };

    fetchDetails();

    return () => controller.abort();
  }, []);

  const scrollTo = (id) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 300);
    } else {
      doScroll();
    }
  };

  const socialLinks = [
    {
      key: "facebook_url",
      label: "Facebook",
      href: details.facebook_url,
      type: "facebook",
    },
    {
      key: "instagram_url",
      label: "Instagram",
      href: details.instagram_url,
      type: "instagram",
    },
    {
      key: "twitter_url",
      label: "X / Twitter",
      href: details.twitter_url,
      type: "twitter",
    },
    {
      key: "tiktok_url",
      label: "TikTok",
      href: details.tiktok_url,
      type: "tiktok",
    },
  ].filter((item) => item.href);

  const hasContactDetails =
    details.address || details.contact_phone || details.contact_email;

  return (
    <footer className="bg-[#0F0A08] text-[#E7D2B6] pt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          <div>
            <h3 className="text-2xl font-bold text-[#C98A5A]">{details.name}</h3>
            <p className="mt-3 text-sm text-[#BFA58A] leading-relaxed">
              Fresh food, warm service, and a comfortable dining experience for every
              guest who visits {details.name}.
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={socialButtonClass}
                    aria-label={social.label}
                  >
                    <SocialIcon type={social.type} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#C98A5A]">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#BFA58A]">
              <li>
                <button
                  onClick={() => scrollTo("home")}
                  className="hover:text-[#E7D2B6] transition text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("menu")}
                  className="hover:text-[#E7D2B6] transition text-left"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("gallery")}
                  className="hover:text-[#E7D2B6] transition text-left"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("contact")}
                  className="hover:text-[#E7D2B6] transition text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#C98A5A]">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-[#BFA58A]">
              {details.address && (
                <li>
                  <span className="text-[#E7D2B6] font-medium">Address:</span>{" "}
                  {details.address}
                </li>
              )}
              {details.contact_phone && (
                <li>
                  <span className="text-[#E7D2B6] font-medium">Phone:</span>{" "}
                  {details.contact_phone}
                </li>
              )}
              {details.contact_email && (
                <li>
                  <span className="text-[#E7D2B6] font-medium">Email:</span>{" "}
                  {details.contact_email}
                </li>
              )}
              {!hasContactDetails && (
                <li>Contact information will appear here once admin settings are saved.</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#C98A5A]">Opening Hours</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#BFA58A]">
              <li>{details.opening_hours || "Opening hours will appear here once updated."}</li>
              <li className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full border border-[#C98A5A]/50 bg-black/20 text-xs">
                  Check Google Maps for the latest visit updates
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#8B5A2B]/30 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#BFA58A]">
            &copy; {new Date().getFullYear()} {details.name}. All rights reserved.
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
