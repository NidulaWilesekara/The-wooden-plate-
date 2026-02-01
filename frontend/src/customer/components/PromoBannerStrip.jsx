import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// helper: safely parse datetime
const toTime = (v) => {
  if (!v) return null;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
};

// active rule:
// - if start_at exists => start_at <= now
// - if end_at exists => end_at >= now
// - if end_at missing => treat as active (optional)
const isActive = (item, nowMs) => {
  const startMs = toTime(item.start_at || item.startAt || item.starts_at);
  const endMs = toTime(item.end_at || item.endAt || item.ends_at || item.expires_at);

  if (startMs !== null && startMs > nowMs) return false;
  if (endMs !== null && endMs < nowMs) return false;

  return true;
};

export default function PromoBannerStrip() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (aliveRef) => {
    try {
      const res = await fetch(`${API_BASE}/api/promotions`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data || [];
      if (aliveRef.current) setItems(list);
    } catch {
      if (aliveRef.current) setItems([]);
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const aliveRef = { current: true };
    setLoading(true);
    load(aliveRef);

    // auto refresh every 60s (so expired ones disappear)
    const t = setInterval(() => load(aliveRef), 60000);

    return () => {
      aliveRef.current = false;
      clearInterval(t);
    };
  }, []);

  const activeItems = useMemo(() => {
    const nowMs = Date.now();
    return (items || []).filter((x) => isActive(x, nowMs));
  }, [items]);

  if (loading) {
    return (
      <section className="px-4 md:px-10 mt-8">
        <div className="h-8 w-44 bg-gray-200 rounded-md mb-4 animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[280px] md:min-w-[380px] h-44 md:h-52 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!activeItems.length) return null;

  return (
    <section className="px-4 md:px-10 mt-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
          Promotions
        </h2>
        <p className="text-sm text-gray-500">Latest offers</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
        {activeItems.map((p) => {
          const img = p.image_url || p.image || p.banner_image || p.banner || "";
          const title = p.title || p.name || "Promotion";
          const subtitle = p.subtitle || p.description || "";
          const href = p.link || p.url || "#";

          return (
            <a
              key={p.id || `${title}-${img}`}
              href={href}
              className="snap-start min-w-[280px] md:min-w-[420px] w-[90%] sm:w-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-44 md:h-52 object-cover"
                  loading="lazy"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-lg font-extrabold line-clamp-1">
                    {title}
                  </p>
                  {subtitle && (
                    <p className="text-white/85 text-sm line-clamp-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
