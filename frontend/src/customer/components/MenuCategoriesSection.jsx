import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const resolveImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/storage/")) return `${API_BASE}${image}`;
  return `${API_BASE}/storage/${image}`;
};

export default function MenuCategoriesSection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/categories`)
      .then((r) => r.json())
      .then((d) =>
        setCategories(
          (d.data || []).map((c) => ({ ...c, image: resolveImageUrl(c.image) }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const goMenu = (catId) => {
    navigate(`/menu?category_id=${catId}`);
  };

  return (
    <section id="menu" className="py-20 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#C98A5A]">
            Our Menu
          </h2>
          <p className="mt-3 text-[#BFA58A]">
            Choose a category to explore the full menu
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-[#1A110D] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => goMenu(c.id)}
                className="text-left rounded-3xl overflow-hidden border border-[#8B5A2B]/45 bg-[#1A110D]
                           hover:border-[#C98A5A]/70 transition shadow-[0_20px_60px_rgba(0,0,0,0.45)] group"
              >
                <div className="relative h-44">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2A1913] flex items-center justify-center text-[#C98A5A]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" />
                </div>

                <div className="p-5">
                  <p className="text-lg font-extrabold text-[#E7D2B6]">
                    {c.name}
                  </p>
                  {c.description && (
                    <p className="mt-1 text-sm text-[#E7D2B6]/70 truncate">{c.description}</p>
                  )}

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#D7B38A]">
                    <span>Explore</span>
                    <span>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
