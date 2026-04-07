import React, { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!form.name || form.name.trim().length === 0) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // Email validation
    if (!form.email || form.email.trim().length === 0) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Message validation
    if (!form.message || form.message.trim().length === 0) {
      newErrors.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    } else if (form.message.trim().length > 5000) {
      newErrors.message = "Message cannot exceed 5000 characters.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server-side validation errors
        if (data.errors) {
          // Convert error arrays to strings (backend returns {"name": ["error msg"]})
          const formattedErrors = {};
          for (const [key, errorArray] of Object.entries(data.errors)) {
            formattedErrors[key] = Array.isArray(errorArray)
              ? errorArray[0]
              : errorArray;
          }
          setErrors(formattedErrors);
        } else {
          setErrors({
            submit: data.message || "Failed to send message. Please try again.",
          });
        }
        return;
      }

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setErrors({
        submit:
          "Network error. Please check your connection and try again.",
      });
      console.error("Error submitting contact form:", err);
    } finally {
      setLoading(false);
    }
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

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-green-900/30 border border-green-600/50 text-green-300">
                ✓ {form.name}, thank you for your message! We'll get back to you soon.
              </div>
            )}

            {/* General Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-600/50 text-red-300">
                ✕ {errors.submit}
              </div>
            )}

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
                  className={`w-full rounded-2xl px-5 py-4 text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 bg-black/25
                             transition border-2
                             ${
                               errors.name
                                 ? "border-red-500/60 focus:ring-red-500/60"
                                 : "border-[#8B5A2B]/40 focus:ring-[#C98A5A]/60"
                             }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400">✕ {errors.name}</p>
                )}
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
                  className={`w-full rounded-2xl px-5 py-4 text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 bg-black/25
                             transition border-2
                             ${
                               errors.email
                                 ? "border-red-500/60 focus:ring-red-500/60"
                                 : "border-[#8B5A2B]/40 focus:ring-[#C98A5A]/60"
                             }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">✕ {errors.email}</p>
                )}
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
                  className={`w-full rounded-2xl px-5 py-4 text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 bg-black/25 resize-none
                             transition border-2
                             ${
                               errors.message
                                 ? "border-red-500/60 focus:ring-red-500/60"
                                 : "border-[#8B5A2B]/40 focus:ring-[#C98A5A]/60"
                             }`}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-400">✕ {errors.message}</p>
                )}
                <p className="mt-2 text-xs text-[#BFA58A]/60">
                  {form.message.length}/5000 characters
                </p>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full
                           bg-gradient-to-r from-[#C98A5A] to-[#D7B38A]
                           text-[#0F0A08] font-bold text-base
                           hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
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
