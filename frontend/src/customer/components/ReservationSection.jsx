import React, { useMemo, useState } from "react";

const ReservationSection = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });

  const timeSlots = useMemo(
    () => [
      "10:00 AM", "10:30 AM",
      "11:00 AM", "11:30 AM",
      "12:00 PM", "12:30 PM",
      "01:00 PM", "01:30 PM",
      "02:00 PM", "02:30 PM",
      "05:00 PM", "05:30 PM",
      "06:00 PM", "06:30 PM",
      "07:00 PM", "07:30 PM",
      "08:00 PM", "08:30 PM",
      "09:00 PM", "09:30 PM",
    ],
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.date || !form.time) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Reservation:", form);
    alert("Reservation submitted! (Later we will connect API)");

    setForm({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: "2",
      notes: "",
    });
  };

  return (
    <section id="reservation" className="py-20 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#C98A5A]">
            Reservation
          </h2>
          <p className="mt-3 text-[#BFA58A] max-w-2xl mx-auto">
            Reserve your table in advance and enjoy the perfect dining experience.
          </p>
        </div>

        {/* Form Card (Centered + Large) */}
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl border border-[#8B5A2B]/50 bg-[#1A110D] p-6 md:p-10
                       shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-semibold text-[#E7D2B6]">
                Book a Table
              </h3>
              <p className="mt-2 text-[#BFA58A] text-sm md:text-base">
                Fill the form below and we’ll confirm your booking via email or phone.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#E7D2B6] mb-2">
                    Phone <span className="text-[#C98A5A]">*</span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="07xxxxxxxx"
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

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-[#E7D2B6] mb-2">
                    Guests
                  </label>
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#8B5A2B]/40 bg-black/25 px-5 py-4
                               text-[#E7D2B6]
                               focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                  >
                    {Array.from({ length: 10 }).map((_, i) => (
                      <option key={i + 1} value={String(i + 1)} className="bg-[#120B08]">
                        {i + 1} Guest{i + 1 > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-[#E7D2B6] mb-2">
                    Date <span className="text-[#C98A5A]">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#8B5A2B]/40 bg-black/25 px-5 py-4
                               text-[#E7D2B6]
                               focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-[#E7D2B6] mb-2">
                    Time <span className="text-[#C98A5A]">*</span>
                  </label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#8B5A2B]/40 bg-black/25 px-5 py-4
                               text-[#E7D2B6]
                               focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                  >
                    <option value="" className="bg-[#120B08]">
                      Select time
                    </option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t} className="bg-[#120B08]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#E7D2B6] mb-2">
                  Special Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Any special request?"
                  className="w-full rounded-2xl border border-[#8B5A2B]/40 bg-black/25 px-5 py-4
                             text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full
                           bg-gradient-to-r from-[#C98A5A] to-[#D7B38A]
                           text-[#0F0A08] font-bold text-base
                           hover:brightness-110 transition"
              >
                Book Table
              </button>

              <p className="text-xs text-[#BFA58A] text-center pt-2">
                By booking, you agree to receive confirmation by email/phone.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-[#8B5A2B]/30" />
      </div>
    </section>
  );
};

export default ReservationSection;
