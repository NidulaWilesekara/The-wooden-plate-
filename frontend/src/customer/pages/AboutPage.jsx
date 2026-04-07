import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const GOOGLE_RATING = "4.9";
const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=The+Wooden+Plate+restaurant+reviews";
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=The+Wooden+Plate%2C+102%2F14%2FB%20Salgaha%20Approach%20Road%2C%20Polgasowita%2010240";

const FALLBACK_DETAILS = {
  name: "The Wooden Plate",
  address: "102/14/B Salgaha Approach Road, Polgasowita 10240",
  contact_email: "",
  contact_phone: "070 767 1667",
  opening_hours: "",
};

const STORY_POINTS = [
  {
    title: "Real guest trust",
    description:
      "A strong Google rating helps new visitors feel confident before they walk in.",
  },
  {
    title: "Warm local atmosphere",
    description:
      "The experience is built around friendly service, familiar food, and easy repeat visits.",
  },
  {
    title: "One clear source",
    description:
      "Guests can check live directions, call the restaurant, and read current public feedback in one place.",
  },
];

const REVIEW_FEATURES = [
  {
    title: "Live Google feedback",
    description:
      "Visitors can open the current review feed instead of relying on old screenshots.",
  },
  {
    title: "Fast trip planning",
    description:
      "The same Google profile also carries directions, phone access, and business updates.",
  },
];

const normalizeText = (value) => String(value || "").trim();

const normalizeDetails = (value = {}) => ({
  name: normalizeText(value.name) || FALLBACK_DETAILS.name,
  address: normalizeText(value.address) || FALLBACK_DETAILS.address,
  contact_email: normalizeText(value.contact_email),
  contact_phone: normalizeText(value.contact_phone) || FALLBACK_DETAILS.contact_phone,
  opening_hours: normalizeText(value.opening_hours),
});

const AboutPage = () => {
  const [details, setDetails] = useState(FALLBACK_DETAILS);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDetails = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/public/details`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load business details");
        }

        if (data?.data) {
          setDetails(normalizeDetails(data.data));
        } else {
          setDetails(FALLBACK_DETAILS);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setDetails(FALLBACK_DETAILS);
        }
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();

    return () => controller.abort();
  }, []);

  const openingHoursText =
    details.opening_hours || "Check Google Maps for the latest opening hours.";
  const contactEmailText =
    details.contact_email || "Use our contact page for online enquiries.";
  const mapQuery = encodeURIComponent(details.address || FALLBACK_DETAILS.address);
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const locationLabel = details.address.includes("Polgasowita")
    ? "Polgasowita"
    : "Local restaurant";

  const infoCards = [
    {
      title: "Address",
      lines: [details.address, "Open the map below for turn-by-turn directions."],
    },
    {
      title: "Contact",
      lines: [details.contact_phone, contactEmailText],
    },
    {
      title: "Opening Hours",
      lines: [openingHoursText, "Google Maps remains the fastest place to check live updates."],
    },
    {
      title: "Services",
      lines: ["Dine-in, takeaway, and direct enquiries.", "Built to make first visits feel easy."],
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#0F0A08] text-[#E7D2B6]">
        <section className="px-4 md:px-10 pt-16 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D7B38A]/25 bg-[#1A120F]/70 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#D7B38A]">
              About {details.name}
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div>
                <h1 className="text-3xl md:text-5xl font-black leading-tight">
                  A warm neighborhood restaurant backed by real guest feedback.
                </h1>

                <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-[#E7D2B6]/76">
                  The goal for this page is simple: tell the story clearly, show the
                  most useful business details, and make it easy for visitors to
                  open the live Google review profile before they plan a visit.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={GOOGLE_REVIEW_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[#D7B38A] to-[#C4A57B] px-5 py-3 font-semibold text-[#1A120F] transition hover:-translate-y-0.5"
                  >
                    Read Google Reviews
                  </a>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-[#D7B38A]/30 bg-[#1A120F]/70 px-5 py-3 font-semibold text-[#E7D2B6] transition hover:bg-[#1A120F]"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-3xl border border-[#D7B38A]/20 bg-[#1A120F]/78 p-5 shadow-xl shadow-[#D7B38A]/10">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#D7B38A]/70">
                    Google Rating
                  </p>
                  <p className="mt-3 text-4xl font-black text-[#D7B38A]">
                    {GOOGLE_RATING}/5
                  </p>
                  <p className="mt-2 text-sm text-[#E7D2B6]/72">
                    Pulled from the restaurant&apos;s public Google listing.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#D7B38A]/20 bg-[#1A120F]/78 p-5 shadow-xl shadow-[#D7B38A]/10">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#D7B38A]/70">
                    Location
                  </p>
                  <p className="mt-3 text-2xl font-bold text-[#E7D2B6]">
                    {locationLabel}
                  </p>
                  <p className="mt-2 text-sm text-[#E7D2B6]/72">{details.address}</p>
                </div>

                <div className="rounded-3xl border border-[#D7B38A]/20 bg-[#1A120F]/78 p-5 shadow-xl shadow-[#D7B38A]/10">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#D7B38A]/70">
                    Business Info
                  </p>
                  <p className="mt-3 text-2xl font-bold text-[#E7D2B6]">
                    {isLoadingDetails ? "Syncing..." : "Ready"}
                  </p>
                  <p className="mt-2 text-sm text-[#E7D2B6]/72">
                    Key details stay easy to verify before guests plan a visit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-10 py-10">
          <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2 md:items-center">
            <div className="overflow-hidden rounded-[2rem] border border-[#D7B38A]/20 shadow-2xl shadow-[#D7B38A]/10">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop"
                alt="Interior dining atmosphere at The Wooden Plate"
                className="h-80 w-full object-cover md:h-[460px]"
              />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-[#D7B38A]/72">
                Our Story
              </p>
              <h2 className="mt-4 text-2xl md:text-4xl font-black leading-tight">
                A restaurant page should feel trustworthy before it tries to sell.
              </h2>

              <p className="mt-6 leading-relaxed text-[#E7D2B6]/75">
                {details.name} is positioned as a comfortable local stop where good
                food, consistent service, and simple hospitality matter more than
                noise. That is why the page now leads with practical trust signals
                instead of placeholder copy.
              </p>

              <p className="mt-4 leading-relaxed text-[#E7D2B6]/75">
                Rather than stuffing the site with copied screenshots, visitors get a
                clean summary here and a direct path to the live Google profile for
                current reviews, directions, and business updates.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {STORY_POINTS.map((point) => (
                  <div
                    key={point.title}
                    className="rounded-2xl border border-[#D7B38A]/20 bg-[#1A120F]/70 p-5"
                  >
                    <p className="text-base font-semibold text-[#E7D2B6]">
                      {point.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#E7D2B6]/70">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-10 py-10">
          <div className="max-w-6xl mx-auto rounded-[2rem] border border-[#D7B38A]/20 bg-linear-to-br from-[#1D1511] via-[#17100D] to-[#0F0A08] p-6 md:p-8 shadow-2xl shadow-[#D7B38A]/10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-[#D7B38A]/72">
                  Google Reviews
                </p>
                <h2 className="mt-4 text-2xl md:text-4xl font-black leading-tight">
                  Show the rating on-site and keep the live review feed one tap away.
                </h2>

                <p className="mt-5 leading-relaxed text-[#E7D2B6]/75">
                  This is the practical, real-world way to feature Google reviews on
                  an About page. Visitors see the rating immediately, then jump to
                  Google for the latest public feedback instead of outdated copied
                  reviews.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {REVIEW_FEATURES.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-[#D7B38A]/15 bg-[#130E0B]/82 p-5"
                    >
                      <p className="text-base font-semibold text-[#E7D2B6]">
                        {feature.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#E7D2B6]/70">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.75rem] border border-[#D7B38A]/22 bg-[#120D0B]/88 p-6 shadow-xl shadow-black/25">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#D7B38A]/70">
                    Current Google Snapshot
                  </p>

                  <div className="mt-5 flex items-end gap-3">
                    <p className="text-6xl font-black leading-none text-[#D7B38A]">
                      {GOOGLE_RATING}
                    </p>
                    <p className="pb-2 text-sm uppercase tracking-[0.2em] text-[#E7D2B6]/70">
                      out of 5
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#E7D2B6]/74">
                    Read the latest public Google reviews, then use the same listing
                    for directions and quick contact.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-[#D7B38A]/12 bg-[#1B130F]/80 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[#D7B38A]/65">
                        Phone
                      </p>
                      <p className="mt-2 text-sm text-[#E7D2B6]">{details.contact_phone}</p>
                    </div>

                    <div className="rounded-2xl border border-[#D7B38A]/12 bg-[#1B130F]/80 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[#D7B38A]/65">
                        Opening Hours
                      </p>
                      <p className="mt-2 text-sm text-[#E7D2B6]">{openingHoursText}</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <a
                        href={GOOGLE_REVIEW_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-linear-to-r from-[#D7B38A] to-[#C4A57B] px-4 py-3 text-sm font-semibold text-[#1A120F] transition hover:-translate-y-0.5"
                      >
                        See Live Reviews
                      </a>

                      <a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#D7B38A]/28 bg-[#1B130F]/75 px-4 py-3 text-sm font-semibold text-[#E7D2B6] transition hover:bg-[#1B130F]"
                      >
                        Directions
                      </a>
                    </div>
                  </div>
                </div>

                <p className="px-1 text-sm leading-relaxed text-[#E7D2B6]/62">
                  For the latest review comments and visit updates, the live Google
                  profile remains the source of truth.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-10 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.26em] text-[#D7B38A]/72">
                Visit Details
              </p>
              <h2 className="mt-4 text-2xl md:text-4xl font-black leading-tight">
                Everything a first-time visitor usually checks before they come in.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {infoCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-[#D7B38A]/18 bg-[#1A120F]/74 p-5 shadow-lg shadow-[#D7B38A]/8"
                >
                  <p className="text-lg font-semibold text-[#E7D2B6]">{card.title}</p>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-[#E7D2B6]/72">
                    {card.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 md:px-10 pb-16 pt-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.26em] text-[#D7B38A]/72">
                Find Us
              </p>
              <h2 className="mt-4 text-2xl md:text-4xl font-black leading-tight">
                Open the map, plan the route, and head over.
              </h2>
              <p className="mt-4 leading-relaxed text-[#E7D2B6]/75">
                The map stays tied to the business address so visitors can move from
                the About page straight into navigation without any extra steps.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#D7B38A]/20 shadow-2xl shadow-[#D7B38A]/10">
              <iframe
                title={`${details.name} location`}
                src={mapEmbedUrl}
                width="100%"
                height="450"
                loading="lazy"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[#D7B38A] to-[#C4A57B] px-5 py-3 font-semibold text-[#1A120F] transition hover:-translate-y-0.5"
              >
                Open in Google Maps
              </a>

              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-[#D7B38A]/30 bg-[#1A120F]/70 px-5 py-3 font-semibold text-[#E7D2B6] transition hover:bg-[#1A120F]"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;
