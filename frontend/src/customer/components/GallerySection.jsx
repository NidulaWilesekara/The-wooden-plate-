import React, { useEffect, useState } from "react";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80",
    title: "Cozy Interior",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80",
    title: "Freshly Served",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
    title: "Signature Dish",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1528823872057-9c018a7b8a0f?auto=format&fit=crop&w=1400&q=80",
    title: "Dessert Corner",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1541542684-4bf98f7b1d0f?auto=format&fit=crop&w=1400&q=80",
    title: "Chef at Work",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?auto=format&fit=crop&w=1400&q=80",
    title: "Warm Ambience",
  },
];

const GallerySection = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const openModal = (img) => {
    setActive(img);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActive(null);
  };

  // ESC key close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="gallery" className="py-20 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#C98A5A]">
            Gallery
          </h2>
          <p className="mt-3 text-[#BFA58A]">
            A glimpse of our flavors, vibes, and moments
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {galleryImages.map((img) => (
            <button
              key={img.id}
              onClick={() => openModal(img)}
              className="group text-left rounded-3xl border border-[#8B5A2B]/50 bg-[#1A110D] overflow-hidden
                         shadow-[0_20px_60px_rgba(0,0,0,0.45)] hover:border-[#C98A5A]/70 transition"
              title="View"
            >
              <div className="relative">
                <img
                  src={img.url}
                  alt={img.title}
                  className="h-56 w-full object-cover group-hover:scale-[1.03] transition duration-300"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition" />

                {/* label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold text-[#E7D2B6] drop-shadow">
                    {img.title}
                  </p>
                  <p className="text-xs text-[#BFA58A] mt-1">
                    Click to preview
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* bottom line */}
        <div className="mt-16 border-t border-[#8B5A2B]/30" />
      </div>

      {/* Modal */}
      {open && active && (
        <div
          className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-4xl rounded-3xl overflow-hidden border border-[#8B5A2B]/60 bg-[#120B08]
                       shadow-[0_25px_90px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* top bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#8B5A2B]/30">
              <div>
                <p className="text-sm font-semibold text-[#E7D2B6]">
                  {active.title}
                </p>
                <p className="text-xs text-[#BFA58A] mt-1">
                  Press ESC or click outside to close
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full border border-[#8B5A2B]/60 bg-black/30
                           flex items-center justify-center hover:bg-black/45 transition"
                title="Close"
              >
                <svg
                  className="w-5 h-5 text-[#C98A5A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* image */}
            <div className="p-4">
              <img
                src={active.url}
                alt={active.title}
                className="w-full max-h-[70vh] object-cover rounded-2xl border border-[#8B5A2B]/40"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;

