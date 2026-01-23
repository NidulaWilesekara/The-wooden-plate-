import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryTabs from "../components/CategoryTabs";
import MenuCarousel from "../components/MenuCarousel";

const MenuPage = () => {
  const categories = [
    { label: "All Dishes", value: "all" },
    { label: "Starters", value: "starters" },
    { label: "Main Course", value: "main" },
    { label: "Desserts", value: "desserts" },
  ];

  const [activeCat, setActiveCat] = useState("all");

  // Dummy items (later API වලින් ගන්න)
  const allItems = [
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
      category: "starters",
      name: "Roasted Garlic Soup",
      description: "Creamy soup with herb-infused oil",
      price: 12,
      image:
        "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      category: "main",
      name: "Grilled Ribeye Steak",
      description: "Prime cut with seasonal vegetables",
      price: 38,
      image:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 5,
      category: "main",
      name: "Pan-Seared Salmon",
      description: "Fresh Atlantic salmon with lemon butter",
      price: 32,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 6,
      category: "main",
      name: "Wild Mushroom Risotto",
      description: "Creamy arborio rice with truffle oil",
      price: 26,
      image:
        "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 7,
      category: "desserts",
      name: "Chocolate Lava Cake",
      description: "Warm cake with molten chocolate center",
      price: 16,
      image:
        "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const filteredItems = useMemo(() => {
    if (activeCat === "all") return allItems;
    return allItems.filter((i) => i.category === activeCat);
  }, [activeCat]);

  return (
    <div className="min-h-screen bg-[#0F0A08] text-[#E7D2B6]">
      <Navbar />

      <main className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#C98A5A]">
              Our Menu
            </h1>
            <p className="mt-3 text-[#BFA58A]">
              Crafted with passion, served with pride
            </p>
          </div>

          {/* Tabs */}
          <CategoryTabs
            categories={categories}
            active={activeCat}
            onChange={setActiveCat}
          />

          {/* Cards row */}
          <div className="mt-10">
            <MenuCarousel items={filteredItems} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MenuPage;
