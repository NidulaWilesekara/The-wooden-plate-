import React, { useState } from "react";

const galleryCards = [
  {
    title: "Cozy Interior",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Freshly Served",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Signature Dish",
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Dessert Corner",
    image:
      "https://images.unsplash.com/photo-1528823872057-9c018a7b8a0f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Chef at Work",
    image:
      "https://images.unsplash.com/photo-1541542684-4bf98f7b1d0f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Warm Ambience",
    image:
      "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?auto=format&fit=crop&w=1400&q=80",
  },
];

const GallerySection = () => {
  const [stopScroll, setStopScroll] = useState(false);

  // speed: increase value to slow down
  const durationMs = galleryCards.length * 2600;

  return (
    <section id="gallery" className="py-20 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#C98A5A]">
            Gallery
          </h2>
          <p className="mt-3 text-[#BFA58A]">
            A glimpse of our flavors, vibes, and moments
          </p>
        </div>

        {/* Marquee */}
        <div
          className="overflow-hidden w-full relative"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 h-full w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-r from-[#0F0A08] to-transparent" />

          <div
            className="marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: durationMs + "ms",
            }}
          >
            <div className="flex">
              {[...galleryCards, ...galleryCards].map((card, index) => (
                <div
                  key={index}
                  className="w-56 md:w-64 mx-3 md:mx-4 h-[20rem] relative group
                             rounded-3xl overflow-hidden border border-[#8B5A2B]/45
                             shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                             hover:border-[#C98A5A]/70 transition-all duration-300"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                    loading="lazy"
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
                    <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 flex items-center justify-center px-5">
                      <p className="text-[#E7D2B6] text-lg font-semibold text-center">
                        {card.title}
                      </p>
                    </div>
                  </div>

                  {/* bottom tag (always visible small) */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 border border-[#8B5A2B]/40 backdrop-blur">
                      <span className="w-2 h-2 rounded-full bg-[#C98A5A]" />
                      <p className="text-xs text-[#E7D2B6]/90">{card.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right fade */}
          <div className="absolute right-0 top-0 h-full w-16 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-[#0F0A08] to-transparent" />
        </div>

        {/* bottom line */}
        <div className="mt-16 border-t border-[#8B5A2B]/30" />
      </div>
    </section>
  );
};

export default GallerySection;
