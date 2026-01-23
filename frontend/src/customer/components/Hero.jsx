import React from "react";

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#0F0A08]"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1920&q=80')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Top Gradient (like screenshot) */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#1A120F]/90 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h1 className="text-[#E7D2B6] text-4xl md:text-6xl font-semibold leading-tight tracking-wide">
            A Taste of Earth, Served in Style
          </h1>

          <p className="mt-5 text-[#D7B38A]/90 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Indulge in an earthy dining experience with modern sophistication.
            Fresh ingredients, cozy vibes, unforgettable flavors.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("menu")}
              className="px-7 py-3 rounded-full bg-[#D7B38A] text-[#1A120F] font-medium
                         hover:opacity-90 transition shadow-lg shadow-black/30"
            >
              View Menu
            </button>

            <button
              onClick={() => scrollTo("reservation")}
              className="px-7 py-3 rounded-full border border-[#D7B38A]/70 text-[#E7D2B6] font-medium
                         hover:bg-[#D7B38A]/10 transition"
            >
              Book a Table
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
