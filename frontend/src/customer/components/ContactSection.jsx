import React, { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Contact message:", form);
    alert("Message sent! (Later we will connect API)");

    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#C98A5A]">
            Contact Us
          </h2>
          <p className="mt-3 text-[#BFA58A]">
            Have a question or want to reach us? Send a message anytime.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* LEFT: Details */}
          <div className="rounded-3xl border border-[#8B5A2B]/50 bg-[#1A110D] p-6 md:p-8
                          shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
            <h3 className="text-2xl font-semibold text-[#E7D2B6]">
              Café Details
            </h3>
            <p className="mt-3 text-[#BFA58A] leading-relaxed">
              We’d love to hear from you. Visit us, call us, or drop an email.
              Our team will respond as soon as possible.
            </p>

            {/* Info boxes */}
            <div className="mt-7 space-y-4">
              {/* Address */}
              <div className="rounded-2xl border border-[#8B5A2B]/40 bg-black/20 p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#C98A5A]/40 bg-black/30 flex items-center justify-center">
                  <span className="text-[#C98A5A]">📍</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#BFA58A]">
                    Address
                  </p>
                  <p className="mt-1 text-sm text-[#E7D2B6]">
                    Colombo, Sri Lanka
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-[#8B5A2B]/40 bg-black/20 p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#C98A5A]/40 bg-black/30 flex items-center justify-center">
                  <span className="text-[#C98A5A]">📞</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#BFA58A]">
                    Phone
                  </p>
                  <p className="mt-1 text-sm text-[#E7D2B6]">
                    +94 77 123 4567
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-[#8B5A2B]/40 bg-black/20 p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#C98A5A]/40 bg-black/30 flex items-center justify-center">
                  <span className="text-[#C98A5A]">✉️</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#BFA58A]">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-[#E7D2B6]">
                    info@woodenplate.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-2xl border border-[#8B5A2B]/40 bg-black/20 p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#C98A5A]/40 bg-black/30 flex items-center justify-center">
                  <span className="text-[#C98A5A]">⏰</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#BFA58A]">
                    Opening Hours
                  </p>
                  <p className="mt-1 text-sm text-[#E7D2B6]">
                    Mon – Sun: 10:00 AM – 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-10 border-t border-[#8B5A2B]/30 pt-6">
              <p className="text-sm text-[#BFA58A] mb-4">Follow us</p>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="px-4 py-2 rounded-full border border-[#C98A5A]/60 text-[#E7D2B6]
                             hover:bg-[#C98A5A]/10 transition text-sm"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="px-4 py-2 rounded-full border border-[#C98A5A]/60 text-[#E7D2B6]
                             hover:bg-[#C98A5A]/10 transition text-sm"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="px-4 py-2 rounded-full border border-[#C98A5A]/60 text-[#E7D2B6]
                             hover:bg-[#C98A5A]/10 transition text-sm"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="rounded-3xl border border-[#8B5A2B]/50 bg-[#1A110D] p-6 md:p-8
                          shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
            <h3 className="text-2xl font-semibold text-[#E7D2B6]">
              Send a Message
            </h3>
            <p className="mt-2 text-[#BFA58A] text-sm">
              Fill the form and we will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#E7D2B6] mb-2">
                  Name <span className="text-[#C98A5A]">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3
                             text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#E7D2B6] mb-2">
                  Email <span className="text-[#C98A5A]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3
                             text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#E7D2B6] mb-2">
                  Message <span className="text-[#C98A5A]">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3
                             text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full
                             bg-[#C98A5A] text-[#0F0A08] font-semibold
                             hover:brightness-110 transition"
                >
                  Send Message
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("reservation")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full
                             border border-[#C98A5A]/70 text-[#E7D2B6]
                             hover:bg-[#C98A5A]/10 transition"
                >
                  Go to Reservation
                </button>
              </div>

              <p className="text-xs text-[#BFA58A] pt-2">
                We typically respond within a few hours.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-[#8B5A2B]/30" />
      </div>
    </section>
  );
};

export default ContactSection;
