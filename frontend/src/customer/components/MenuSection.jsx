import React, { useMemo, useState } from "react";
import CategoryTabs from "./CategoryTabs";
import MenuCarousel from "./MenuCarousel";

const MenuSection = () => {
  const categories = [
    { label: "All Dishes", value: "all" },
    { label: "Starters", value: "starters" },
    { label: "Main Course", value: "main" },
    { label: "Desserts", value: "desserts" },
  ];

  const [activeCat, setActiveCat] = useState("all");

  // dummy menu items (later API)
  const items = [
    {
      id: 1,
      category: "starters",
      name: "Truffle Mushroom Bruschetta",
      description: "Artisan bread topped with sautéed mushrooms",
      price: 14,
      image:
        "https://images.unsplash.com/photo-1541013406133-8ec3a2d08097?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      category: "starters",
      name: "Artisan Cheese Board",
      description: "Selection of premium aged cheeses",
      price: 18,
      image:
        "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      category: "main",
      name: "Grilled Ribeye Steak",
      description: "Prime cut with seasonal vegetables",
      price: 38,
      image:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      category: "main",
      name: "Pan-Seared Salmon",
      description: "Fresh Atlantic salmon with lemon butter",
      price: 32,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 5,
      category: "desserts",
      name: "Wild Mushroom Risotto",
      description: "Creamy arborio rice with truffle oil",
      price: 26,
      image:
        "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const filteredItems = useMemo(() => {
    if (activeCat === "all") return items;
    return items.filter((i) => i.category === activeCat);
  }, [activeCat]);

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

        {/* Categories */}
        <CategoryTabs
          categories={categories}
          active={activeCat}
          onChange={setActiveCat}
        />

        {/* Cards (horizontal scroll) */}
        <div className="mt-10">
          <MenuCarousel items={filteredItems} />
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
