import React from "react";

const specials = [
  {
    id: 1,
    name: "Chef's Signature Beef Wellington",
    desc:
      "Tender beef wrapped in puff pastry with mushroom duxelles, served with red wine reduction.",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Wood-Fired Sea Bass",
    desc:
      "Fresh sea bass with herbs, roasted vegetables, and lemon butter sauce.",
    price: 36,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Truffle Lobster Pasta",
    desc:
      "Fresh lobster with handmade pasta in a creamy truffle sauce.",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
  },
];

const ChefsSpecials = () => {
  return (
    <section id="specials" className="py-20 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#C98A5A]">
            Chef&apos;s Specials
          </h2>
          <p className="mt-3 text-[#BFA58A]">
            Signature dishes you cannot miss
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[#8B5A2B]/60 bg-[#1A110D] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-52 w-full object-cover"
                />

                {/* Heart */}
                <button
                  className="absolute top-4 right-4 w-10 h-10 rounded-full 
                             bg-black/40 border border-[#8B5A2B]/60
                             flex items-center justify-center hover:bg-black/55 transition"
                  title="Save"
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
                      d="M20.84 4.61c-1.54-1.34-3.77-1.33-5.3.02L12 8.09 8.46 4.63c-1.53-1.35-3.76-1.36-5.3-.02-1.74 1.52-1.85 4.16-.33 5.82l8.47 8.64a1 1 0 0 0 1.43 0l8.47-8.64c1.52-1.66 1.41-4.3-.33-5.82z"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#E7D2B6] leading-snug">
                  {item.name}
                </h3>

                <p className="mt-3 text-sm text-[#BFA58A] leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-2xl font-bold text-[#C98A5A]">
                    ${item.price}
                  </p>

                  <button
                    className="px-5 py-2 rounded-full bg-[#C98A5A] text-[#1A110D]
                               font-semibold text-sm hover:opacity-90 transition"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional bottom spacing line */}
        <div className="mt-16 border-t border-[#8B5A2B]/30" />
      </div>
    </section>
  );
};

export default ChefsSpecials;
