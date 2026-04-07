import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const resolveImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/storage/")) return `${API_BASE}${image}`;
  return `${API_BASE}/storage/${image}`;
};

const ChefsSpecials = () => {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecials = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/public/featured-items`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load chef specials");
        }

        setSpecials(Array.isArray(data?.data) ? data.data : []);
      } catch {
        setSpecials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecials();
  }, []);

  const hasSpecials = useMemo(() => specials.length > 0, [specials.length]);

  if (!loading && !hasSpecials) {
    return null;
  }

  return (
    <section id="specials" className="py-20 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#C98A5A]">
            Chef&apos;s Specials
          </h2>
          <p className="mt-3 text-[#BFA58A]">Signature dishes you cannot miss</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className="rounded-3xl border border-[#8B5A2B]/60 bg-[#1A110D] overflow-hidden animate-pulse"
              >
                <div className="h-52 w-full bg-[#2a1b15]" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-[#2a1b15] rounded" />
                  <div className="h-4 bg-[#2a1b15] rounded" />
                  <div className="h-4 bg-[#2a1b15] rounded w-3/4" />
                  <div className="h-8 bg-[#2a1b15] rounded w-24 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-0 h-full w-8 md:w-12 z-10 pointer-events-none bg-linear-to-r from-[#0F0A08] to-transparent" />
            <div className="absolute right-0 top-0 h-full w-8 md:w-12 z-10 pointer-events-none bg-linear-to-l from-[#0F0A08] to-transparent" />

            <div className="overflow-x-auto overflow-y-hidden pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex flex-nowrap gap-6 snap-x snap-mandatory">
                {specials.map((item) => (
                  <div
                    key={item.id}
                    className="shrink-0 basis-[85%] sm:basis-[48%] lg:basis-[32%] snap-start rounded-3xl border border-[#8B5A2B]/60 bg-[#1A110D] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                  >
                    <div className="relative">
                      {resolveImageUrl(item.image) ? (
                        <img
                          src={resolveImageUrl(item.image)}
                          alt={item.name}
                          className="h-52 w-full object-cover"
                        />
                      ) : (
                        <div className="h-52 w-full bg-[#2a1b15]" />
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#E7D2B6] leading-snug">
                        {item.name}
                      </h3>

                      <p className="mt-3 text-sm text-[#BFA58A] leading-relaxed line-clamp-3">
                        {item.description || "Our chef's recommended dish."}
                      </p>

                      <div className="mt-6">
                        <p className="text-2xl font-bold text-[#C98A5A]">
                          Rs. {Number(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 border-t border-[#8B5A2B]/30" />
      </div>
    </section>
  );
};

export default ChefsSpecials;
