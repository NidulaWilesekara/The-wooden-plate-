import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryTabs from "./CategoryTabs";
import MenuCarousel from "./MenuCarousel";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const resolveImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/storage/")) return `${API_BASE}${image}`;
  return `${API_BASE}/storage/${image}`;
};

const MenuSection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []))
      .catch(console.error);

    fetch(`${API_BASE}/api/public/menu-items`)
      .then((r) => r.json())
      .then((d) =>
        setItems(
          (d.data || []).map((i) => ({ ...i, image: resolveImageUrl(i.image) }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allCategories = [
    { label: "All Dishes", value: "all" },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
  ];

  const handleCategoryChange = (value) => {
    if (value === "all") {
      navigate("/menu");
    } else {
      navigate(`/menu?category_id=${value}`);
    }
  };

  return (
    <section
      id="menu"
      className="py-20 bg-[#0F0A08] text-[#E7D2B6]"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#C98A5A]">
            Our Menu
          </h2>
          <p className="mt-3 text-[#BFA58A]">
            Crafted with passion, served with pride
          </p>
        </div>

        {/* Categories — clicking navigates to /menu?category_id=... */}
        <CategoryTabs
          categories={allCategories}
          active="all"
          onChange={handleCategoryChange}
        />

        {/* Cards (horizontal scroll) */}
        <div className="mt-10">
          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="shrink-0 basis-[85%] sm:basis-[48%] lg:basis-[32%] h-64 rounded-2xl bg-[#1A110D] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <MenuCarousel items={items} />
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
