import React, { useState, useRef } from "react";

const MenuCarousel = ({ items = [], onAddToCart }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Sample menu items if none provided
  const menuItems = items.length > 0 ? items : [
    {
      id: 1,
      name: "Grilled Chicken",
      description: "Tender grilled chicken with herbs and spices",
      price: 1500,
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Seafood Platter",
      description: "Fresh prawns, calamari, and fish fillet",
      price: 2800,
      image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Vegetable Curry",
      description: "Mixed vegetables in rich coconut curry",
      price: 950,
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Beef Steak",
      description: "Premium beef steak with pepper sauce",
      price: 3200,
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      name: "Pasta Carbonara",
      description: "Creamy pasta with bacon and parmesan",
      price: 1350,
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Tom Yum Soup",
      description: "Spicy Thai soup with prawns",
      price: 1100,
      image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#1A120F]/90 border border-[#D7B38A]/30 text-[#D7B38A] flex items-center justify-center hover:bg-[#D7B38A] hover:text-[#1A120F] transition -translate-x-1/2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#1A120F]/90 border border-[#D7B38A]/30 text-[#D7B38A] flex items-center justify-center hover:bg-[#D7B38A] hover:text-[#1A120F] transition translate-x-1/2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-72 bg-[#1A120F] rounded-2xl overflow-hidden border border-[#D7B38A]/10 hover:border-[#D7B38A]/30 transition group"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A120F] to-transparent opacity-60" />
              
              {/* Price Badge */}
              <div className="absolute top-3 right-3 bg-[#D7B38A] text-[#1A120F] px-3 py-1 rounded-full text-sm font-semibold">
                Rs. {item.price.toLocaleString()}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#E7D2B6]">{item.name}</h3>
              <p className="text-sm text-[#E7D2B6]/60 mt-1 line-clamp-2">{item.description}</p>
              
              <button
                onClick={() => onAddToCart?.(item)}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#D7B38A]/10 border border-[#D7B38A]/30 text-[#D7B38A] text-sm font-medium hover:bg-[#D7B38A] hover:text-[#1A120F] transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MenuCarousel;
