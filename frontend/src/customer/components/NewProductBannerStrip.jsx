import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const toTime = (v) => {
  if (!v) return null;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
};

const isActive = (item, nowMs) => {
  const startMs = toTime(item.start_at || item.startAt || item.starts_at);
  const endMs = toTime(item.end_at || item.endAt || item.ends_at || item.expires_at);

  if (startMs !== null && startMs > nowMs) return false;
  if (endMs !== null && endMs < nowMs) return false;
  return true;
};

export default function NewProductBannerStrip() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (aliveRef) => {
    try {
      const res = await fetch(`${API_BASE}/api/new-products`, {
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

    // refresh every 60s for expiry auto-hide
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
        <div className="h-8 w-52 bg-gray-200 rounded-md mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 md:h-52 bg-gray-200 rounded-2xl animate-pulse"
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
          New Arrivals
        </h2>
        <p className="text-sm text-gray-500">Just added</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeItems.slice(0, 2).map((p) => {
          const img = p.image_url || p.image || p.banner_image || p.banner || "";
          const name = p.name || p.title || "New Product";
          const desc =
            p.short_description ||
            p.description ||
            "Try our newest delicious item today!";

          return (
            <div
              key={p.id || `${name}-${img}`}
              className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={img}
                alt={name}
                className="w-full h-44 md:h-52 object-cover"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <p className="text-white text-lg font-extrabold line-clamp-1">
                  {name}
                </p>
                <p className="text-white/85 text-sm line-clamp-2 max-w-[85%]">
                  {desc}
                </p>

                <div className="mt-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition"
                  >
                    View Item
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
