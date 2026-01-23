import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    // Later: API call -> POST /api/newsletter
    console.log("Newsletter email:", email);

    alert("Subscribed successfully! (Later we will connect API)");
    setEmail("");
  };

  return (
    <section className="py-16 bg-[#0F0A08] text-[#E7D2B6]">
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="rounded-3xl border border-[#8B5A2B]/50 bg-[#1A110D] p-8 md:p-12
                     shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#C98A5A]">
                Join Our Newsletter
              </h3>
              <p className="mt-3 text-[#BFA58A] leading-relaxed">
                Get special offers, new menu updates, and exclusive deals straight
                to your inbox.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full border border-[#C98A5A]/50 bg-black/20 text-[#E7D2B6]">
                  Weekly offers
                </span>
                <span className="text-xs px-3 py-1 rounded-full border border-[#C98A5A]/50 bg-black/20 text-[#E7D2B6]">
                  New dishes
                </span>
                <span className="text-xs px-3 py-1 rounded-full border border-[#C98A5A]/50 bg-black/20 text-[#E7D2B6]">
                  Event updates
                </span>
              </div>
            </div>

            {/* Right form */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 rounded-full border border-[#8B5A2B]/45 bg-black/25 px-5 py-3
                             text-[#E7D2B6] placeholder:text-[#BFA58A]/60
                             focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                />

                <button
                  type="submit"
                  className="px-7 py-3 rounded-full bg-[#C98A5A] text-[#0F0A08] font-semibold
                             hover:brightness-110 transition"
                >
                  Subscribe
                </button>
              </div>

              <p className="mt-3 text-xs text-[#BFA58A]">
                No spam — only tasty updates. You can unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-14 border-t border-[#8B5A2B]/30" />
      </div>
    </section>
  );
};

export default Newsletter;
