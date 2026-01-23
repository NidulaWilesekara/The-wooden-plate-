import React from "react";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="w-full bg-[#0F0A08] text-[#E7D2B6] py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Card Wrapper */}
        <div className="rounded-2xl bg-gradient-to-b from-[#1A120F] to-[#0F0A08] border border-[#D7B38A]/20 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left image */}
            <div className="relative min-h-[320px] lg:min-h-[520px]">
              <img
                src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80"
                alt="Our Story"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* overlay */}
              <div className="absolute inset-0 bg-black/35" />

              {/* border glow like screenshot */}
              <div className="absolute inset-6 rounded-2xl border border-[#D7B38A]/35" />
            </div>

            {/* Right content */}
            <div className="p-8 md:p-12">
              <h2 className="text-4xl md:text-5xl font-semibold text-[#D7B38A]">
                Our Story
              </h2>

              {/* underline */}
              <div className="mt-4 h-[2px] w-16 bg-[#D7B38A]/70 rounded-full" />

              <p className="mt-6 text-[#E7D2B6]/85 leading-relaxed">
                At The Wooden Plate, we believe that dining is an experience
                that engages all the senses. Our commitment to locally-sourced,
                fresh ingredients combined with warm hospitality creates dishes
                that are both rustic and refined.
              </p>

              <p className="mt-5 text-[#E7D2B6]/85 leading-relaxed">
                Founded in 2018, our restaurant has become a beloved destination
                for those seeking authentic flavors in a cozy, inviting
                atmosphere. Every detail—from our handcrafted wooden tables to
                our carefully curated menu—reflects our passion for natural
                beauty and exceptional cuisine.
              </p>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-[#D7B38A]">
                    5+
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-[#E7D2B6]/70">
                    Years of Excellence
                  </p>
                </div>

                <div>
                  <p className="text-3xl md:text-4xl font-bold text-[#D7B38A]">
                    50+
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-[#E7D2B6]/70">
                    Signature Dishes
                  </p>
                </div>

                <div>
                  <p className="text-3xl md:text-4xl font-bold text-[#D7B38A]">
                    10k+
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-[#E7D2B6]/70">
                    Happy Guests
                  </p>
                </div>
              </div>

              {/* CTA buttons (optional) */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href="#menu"
                  className="px-7 py-3 rounded-full bg-[#D7B38A] text-[#1A120F] font-medium
                             hover:opacity-90 transition shadow-lg shadow-black/30 text-center"
                >
                  Explore Menu
                </a>

                <a
                  href="#reservation"
                  className="px-7 py-3 rounded-full border border-[#D7B38A]/70 text-[#E7D2B6] font-medium
                             hover:bg-[#D7B38A]/10 transition text-center"
                >
                  Reserve a Table
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider space like screenshot */}
        <div className="mt-16 border-t border-[#D7B38A]/10" />
      </div>
    </section>
  );
};

export default AboutSection;
