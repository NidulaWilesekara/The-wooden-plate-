import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MenuItemTiltCard from "../components/MenuItemTiltCard";

const categories = [
  { label: "All Items", value: "all" },
  { label: "Burgers", value: "burgers" },
  { label: "Sides", value: "sides" },
  { label: "Drinks", value: "drinks" },
  { label: "Desserts", value: "desserts" },
];

// dummy items (later API)
const allItems = [
  {
    id: 1,
    category: "burgers",
    name: "Classic Beef Burger",
    description: "Juicy beef patty, cheese, lettuce, house sauce",
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    category: "burgers",
    name: "Crispy Chicken Burger",
    description: "Crunchy chicken, spicy mayo, fresh slaw",
    price: 1650,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    category: "sides",
    name: "Loaded Fries",
    description: "Cheese sauce, spicy bits, fresh herbs",
    price: 950,
    image:
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    category: "drinks",
    name: "Iced Coffee",
    description: "Chilled coffee with milk & sweetness",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    category: "desserts",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with soft center",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1541781408260-3c22b5f65b25?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function MenuPage() {
  const [params] = useSearchParams();
  const initialCat = params.get("cat") || "all";

  const [activeCat, setActiveCat] = useState(
    categories.some((c) => c.value === initialCat) ? initialCat : "all"
  );
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = [...allItems];
    if (activeCat !== "all") list = list.filter((i) => i.category === activeCat);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(t) ||
          i.description.toLowerCase().includes(t)
      );
    }
    return list;
  }, [activeCat, q]);

  return (
    <main className="min-h-screen bg-[#0F0A08] text-[#E7D2B6]">
      <section className="px-4 md:px-10 pt-14 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#C98A5A]">
              Explore Our Menu
            </h1>
            <p className="mt-3 text-[#BFA58A] max-w-2xl mx-auto">
              Pick a category and discover your next favorite bite.
            </p>
          </div>

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
            {categories.map((c) => {
              const active = c.value === activeCat;
              return (
                <button
                  key={c.value}
                  onClick={() => setActiveCat(c.value)}
                  className={`px-5 py-2.5 rounded-full border transition text-sm font-semibold
                    ${
                      active
                        ? "bg-[#C98A5A] text-[#0F0A08] border-[#C98A5A]"
                        : "bg-[#1A110D] text-[#E7D2B6] border-[#8B5A2B]/45 hover:border-[#C98A5A]/70"
                    }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Items grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <MenuItemTiltCard
                key={item.id}
                item={item}
                onAddToCart={(x) => console.log("Add to cart:", x)}
              />
            ))}
          </div>

          {/* empty */}
          {!filtered.length && (
            <div className="mt-14 text-center text-[#BFA58A]">
              No items found for your filter.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
