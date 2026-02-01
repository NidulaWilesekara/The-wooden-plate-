import React from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 md:px-8 bg-[#0F0A08]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto items-center">
        
        {/* LEFT: Big Image (takes full left) */}
        <div className="rounded-3xl overflow-hidden border border-[#D7B38A]/20 shadow-2xl shadow-[#D7B38A]/10">
          <img
            className="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover"
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop"
            alt="The Wooden Plate Restaurant"
          />
        </div>

        {/* RIGHT: Content */}
        <div className="text-sm md:text-base text-[#E7D2B6]/70">
          <h1 className="text-xl uppercase font-semibold text-[#E7D2B6]">
            What we do?
          </h1>
          <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-[#D7B38A] to-[#D7B38A]/20 mt-2"></div>

          <p className="mt-8 leading-relaxed">
            The Wooden Plate brings you a unique dining experience that combines
            traditional Sri Lankan flavors with modern culinary techniques. Our
            passion for quality ingredients and authentic recipes shines through
            in every dish we serve.
          </p>

          <p className="mt-4 leading-relaxed">
            From intimate dinners to family gatherings, we provide a warm,
            inviting atmosphere where great food meets exceptional service.
            Every meal is crafted with care to create memorable moments for our guests.
          </p>

          <p className="mt-4 leading-relaxed">
            Whether you're craving classic favorites or looking to explore new
            flavors, our talented chefs are dedicated to delivering an unforgettable
            culinary journey.
          </p>

          {/* ✅ FIX: route should be /about (not /About) */}
          <Link
            to="/about"
            className="flex items-center w-max gap-2 mt-8 hover:-translate-y-0.5 transition
                       bg-gradient-to-r from-[#D7B38A] to-[#C4A57B]
                       py-3 px-8 rounded-full text-[#1A120F] font-medium"
          >
            <span>Read more</span>
            <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                fill="#1A120F"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
