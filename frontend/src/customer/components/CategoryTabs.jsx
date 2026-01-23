import React from "react";

const CategoryTabs = ({ categories, active, onChange }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => {
          const isActive = active === cat.value;

          return (
            <button
              key={cat.value}
              onClick={() => onChange(cat.value)}
              className={[
                "px-6 py-2 rounded-full text-sm font-semibold transition-all",
                "border",
                isActive
                  ? "bg-[#C98A5A] text-[#1A0F0B] border-[#C98A5A] shadow-[0_0_25px_rgba(201,138,90,0.25)]"
                  : "bg-transparent text-[#E7D2B6] border-[#5A3A2A] hover:bg-[#2A1913]",
              ].join(" ")}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
