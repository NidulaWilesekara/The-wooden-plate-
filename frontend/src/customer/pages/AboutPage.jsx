import React from "react";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#0F0A08] text-[#E7D2B6]">
      {/* Header / Hero */}
      <section className="px-4 md:px-10 pt-14 pb-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm tracking-widest uppercase text-[#E7D2B6]/70">
            About The Wooden Plate
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
            A warm place for great burgers,
            <span className="text-[#D7B38A]"> crafted with care</span>.
          </h1>

          <p className="mt-6 text-base md:text-lg text-[#E7D2B6]/75 max-w-3xl leading-relaxed">
            At The Wooden Plate, we focus on bold flavors, fresh ingredients, and a
            cozy dining experience. From classic favorites to signature creations,
            every item is made to satisfy — whether you dine in, take away, or order
            online.
          </p>

          {/* quick highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Fresh Ingredients", desc: "Quality ingredients, cooked fresh daily." },
              { title: "Fast Service", desc: "Quick prep without sacrificing taste." },
              { title: "Customer First", desc: "Friendly service & consistent quality." },
            ].map((x) => (
              <div
                key={x.title}
                className="rounded-2xl border border-[#D7B38A]/20 bg-[#1A120F]/70 p-5 shadow-xl shadow-[#D7B38A]/10"
              >
                <p className="text-lg font-bold text-[#E7D2B6]">{x.title}</p>
                <p className="mt-2 text-sm text-[#E7D2B6]/70">{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story + image */}
      <section className="px-4 md:px-10 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden border border-[#D7B38A]/20 shadow-2xl shadow-[#D7B38A]/10">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop"
              alt="Our burgers"
              className="w-full h-[320px] md:h-[420px] object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Our Story
            </h2>
            <div className="w-28 h-[3px] rounded-full bg-gradient-to-r from-[#D7B38A] to-[#D7B38A]/20 mt-3" />

            <p className="mt-6 text-[#E7D2B6]/75 leading-relaxed">
              We started with a simple idea: serve food that feels familiar, but
              tastes unforgettable. Our menu is inspired by timeless comfort foods
              and elevated with house-made sauces, fresh buns, and perfectly
              seasoned fillings.
            </p>

            <p className="mt-4 text-[#E7D2B6]/75 leading-relaxed">
              Whether it’s a quick bite after work or a weekend meal with friends,
              we want every visit to feel easy, warm, and worth coming back for.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#D7B38A]/20 bg-[#1A120F]/70 p-5">
                <p className="text-2xl font-extrabold text-[#D7B38A]">5K+</p>
                <p className="text-sm text-[#E7D2B6]/70 mt-1">Happy customers</p>
              </div>
              <div className="rounded-2xl border border-[#D7B38A]/20 bg-[#1A120F]/70 p-5">
                <p className="text-2xl font-extrabold text-[#D7B38A]">⭐ 4.7</p>
                <p className="text-sm text-[#E7D2B6]/70 mt-1">Average rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you usually add in About page */}
      <section className="px-4 md:px-10 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Opening Hours", lines: ["Mon–Fri: 10 AM – 10 PM", "Sat–Sun: 11 AM – 11 PM"] },
            { title: "Contact", lines: ["Phone: +94 XX XXX XXXX", "Email: hello@woodenplate.com"] },
            { title: "Services", lines: ["Dine-in • Takeaway", "Delivery • Reservations"] },
          ].map((box) => (
            <div
              key={box.title}
              className="rounded-2xl border border-[#D7B38A]/20 bg-[#1A120F]/70 p-5"
            >
              <p className="text-lg font-bold">{box.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-[#E7D2B6]/75">
                {box.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section (AFTER description) ✅ */}
      <section className="px-4 md:px-10 pb-16 pt-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Find Us
          </h2>
          <p className="mt-3 text-[#E7D2B6]/75 max-w-2xl">
            Visit us in person. Use the map below for directions. We can’t wait to
            serve you!
          </p>

          <div className="mt-6 rounded-2xl overflow-hidden border border-[#D7B38A]/20 shadow-2xl shadow-[#D7B38A]/10">
            {/* ✅ Replace this embed link with your real location */}
            <iframe
              title="The Wooden Plate Location"
              src="https://www.google.com/maps?q=Colombo%20Sri%20Lanka&output=embed"
              width="100%"
              height="450"
              loading="lazy"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#D7B38A] to-[#C4A57B] text-[#1A120F] font-semibold hover:-translate-y-0.5 transition"
            >
              Open in Google Maps
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-[#D7B38A]/30 bg-[#1A120F]/70 text-[#E7D2B6] font-semibold hover:bg-[#1A120F] transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
