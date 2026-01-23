import React from "react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 md:px-8 bg-[#0F0A08]">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl mx-auto">
        {/* Image with overlay card */}
        <div className="relative shadow-2xl shadow-[#D7B38A]/20 rounded-2xl overflow-hidden shrink-0">
          <img
            className="max-w-md w-full object-cover rounded-2xl"
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=451&h=451&auto=format&fit=crop"
            alt="The Wooden Plate Restaurant"
          />
          {/* Overlay card */}
          <div className="flex items-center gap-3 max-w-72 absolute bottom-6 left-6 bg-[#1A120F]/95 backdrop-blur p-4 rounded-xl border border-[#D7B38A]/20">
            <div className="flex -space-x-3 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="customer"
                className="size-9 rounded-full border-[3px] border-[#1A120F] hover:-translate-y-1 transition z-[1]"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="customer"
                className="size-9 rounded-full border-[3px] border-[#1A120F] hover:-translate-y-1 transition z-[2]"
              />
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                alt="customer"
                className="size-9 rounded-full border-[3px] border-[#1A120F] hover:-translate-y-1 transition z-[3]"
              />
              <div className="flex items-center justify-center text-xs text-[#1A120F] font-semibold size-9 rounded-full border-[3px] border-[#1A120F] bg-[#D7B38A] hover:-translate-y-1 transition z-[4]">
                5K+
              </div>
            </div>
            <p className="text-sm font-medium text-[#E7D2B6]">Happy customers served</p>
          </div>
        </div>

        {/* Content */}
        <div className="text-sm text-[#E7D2B6]/70 max-w-lg">
          <h1 className="text-xl uppercase font-semibold text-[#E7D2B6]">What we do?</h1>
          <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-[#D7B38A] to-[#D7B38A]/20 mt-2"></div>
          
          <p className="mt-8">
            The Wooden Plate brings you a unique dining experience that combines
            traditional Sri Lankan flavors with modern culinary techniques. Our
            passion for quality ingredients and authentic recipes shines through
            in every dish we serve.
          </p>
          <p className="mt-4">
            From intimate dinners to family gatherings, we provide a warm, inviting
            atmosphere where great food meets exceptional service. Every meal is
            crafted with care to create memorable moments for our guests.
          </p>
          <p className="mt-4">
            Whether you're craving classic favorites or looking to explore new
            flavors, our talented chefs are dedicated to delivering an
            unforgettable culinary journey.
          </p>

          <a
            href="/about"
            className="flex items-center w-max gap-2 mt-8 hover:-translate-y-0.5 transition bg-gradient-to-r from-[#D7B38A] to-[#C4A57B] py-3 px-8 rounded-full text-[#1A120F] font-medium"
          >
            <span>Read more</span>
            <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                fill="#1A120F"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
