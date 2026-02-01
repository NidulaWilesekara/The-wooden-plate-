import React, { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

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
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#C98A5A]">
            Contact Us
          </h2>
          <p className="mt-3 text-[#BFA58A] max-w-2xl mx-auto">
            Have a question, feedback, or a special request? Send us a message
            anytime — we’ll get back to you as soon as possible.
          </p>
        </div>

        {/* Form Card (Centered) */}
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-3xl border border-[#8B5A2B]/50 bg-[#1A110D] p-6 md:p-10
                       shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
          >
            {/* Small header inside card */}
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-semibold text-[#E7D2B6]">
                Send a Message
              </h3>
              <p className="mt-2 text-[#BFA58A] text-sm md:text-base">
                Fill the form below and our team will reply shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full rounded-2xl border border-[#8B5A2B]/40 bg-black/25 px-5 py-4
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
                  className="w-full rounded-2xl border border-[#8B5A2B]/40 bg-black/25 px-5 py-4
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
                  rows={7}
                  placeholder="Write your message..."
                  className="w-full rounded-2xl border border-[#8B5A2B]/40 bg-black/25 px-5 py-4
                             text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60 resize-none"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full
                           bg-gradient-to-r from-[#C98A5A] to-[#D7B38A]
                           text-[#0F0A08] font-bold text-base
                           hover:brightness-110 transition"
              >
                Send Message
              </button>

              <p className="text-xs text-[#BFA58A] text-center pt-2">
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
