import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MenuItemTiltCard from "../components/MenuItemTiltCard";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const resolveImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/storage/")) return `${API_BASE}${image}`;
  return `${API_BASE}/storage/${image}`;
};

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const activeCatId = params.get("category_id") || "all";

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // Fetch categories once
  useEffect(() => {
    fetch(`${API_BASE}/api/public/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []))
      .catch(console.error);
  }, []);

  // Fetch items whenever category changes
  useEffect(() => {
    setLoading(true);
    const url =
      activeCatId === "all"
        ? `${API_BASE}/api/public/menu-items`
        : `${API_BASE}/api/public/menu-items?category_id=${activeCatId}`;

    fetch(url)
      .then((r) => r.json())
      .then((d) =>
        setItems(
          (d.data || []).map((i) => ({ ...i, image: resolveImageUrl(i.image) }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCatId]);

  const allCategories = [
    { id: "all", name: "All Items" },
    ...categories,
  ];

  const handleCategoryClick = (id) => {
    setQ("");
    if (id === "all") {
      setParams({});
    } else {
      setParams({ category_id: id });
    }
  };

  // Client-side search on already-fetched items
  const filteredItems = items.filter((i) => {
    if (!q.trim()) return true;
    const t = q.toLowerCase();
    return (
      i.name.toLowerCase().includes(t) ||
      (i.description || "").toLowerCase().includes(t)
    );
  });

  return (
    <>
      <main className="min-h-screen bg-[#0F0A08] text-[#E7D2B6]">
        <section className="px-4 md:px-10 pt-14 pb-10">
          <div className="max-w-6xl mx-auto">
            {/* Search */}
            <div className="mt-10 max-w-2xl mx-auto">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search items..."
                className="w-full rounded-2xl border border-[#8B5A2B]/45 bg-black/25 px-5 py-4
                           text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                           focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
              />
            </div>

            {/* Category tabs */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {allCategories.map((c) => {
                const id = c.id;
                const active = id.toString() === activeCatId.toString();
                return (
                  <button
                    key={id}
                    onClick={() => handleCategoryClick(id)}
                    className={`px-5 py-2.5 rounded-full border transition text-sm font-semibold
                      ${
                        active
                          ? "bg-[#C98A5A] text-[#0F0A08] border-[#C98A5A]"
                          : "bg-[#1A110D] text-[#E7D2B6] border-[#8B5A2B]/45 hover:border-[#C98A5A]/70"
                      }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>

            {/* Items grid */}
            {loading ? (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-72 rounded-2xl bg-[#1A110D] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemTiltCard
                    key={item.id}
                    item={item}
                    onAddToCart={(x) => console.log("Add to cart:", x)}
                  />
                ))}
              </div>
            )}

            {!loading && !filteredItems.length && (
              <div className="mt-14 text-center text-[#BFA58A]">
                No items found for your filter.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
