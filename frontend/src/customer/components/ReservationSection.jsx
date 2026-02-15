import React from "react";
import { Link } from "react-router-dom";

const ReservationSection = () => {
  return (
    <section id="reservation" className="py-20 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-[#8B5A2B]/30 shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
                alt="Restaurant Interior"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#C98A5A]/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#D7B38A]/10 rounded-full blur-xl" />
          </div>

          {/* Right Side - Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#C98A5A] mb-6">
              Reserve Your Table
            </h2>
            <p className="text-lg md:text-xl text-[#BFA58A] mb-4 leading-relaxed">
              Experience the perfect dining atmosphere at The Wooden Plate.
              Reserve your table in advance and let us prepare an unforgettable
              culinary journey for you.
            </p>
            <p className="text-[#E7D2B6]/70 mb-8">
              Choose from our cozy tables, select your preferred date and time,
              and we will have everything ready for your arrival.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C98A5A]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#C98A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-[#E7D2B6]">Easy Online Booking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C98A5A]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#C98A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-[#E7D2B6]">Flexible Timing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C98A5A]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#C98A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-[#E7D2B6]">Email Confirmation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C98A5A]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#C98A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm text-[#E7D2B6]">Group Bookings</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/reservation"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full
                         bg-gradient-to-r from-[#C98A5A] to-[#D7B38A]
                         text-[#0F0A08] font-bold text-lg
                         hover:brightness-110 hover:scale-105 transition-all duration-300
                         shadow-[0_10px_40px_rgba(201,138,90,0.3)]"
            >
              <span>Book a Table</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-16 border-t border-[#8B5A2B]/30" />
      </div>
    </section>
  );
};

export default ReservationSection;