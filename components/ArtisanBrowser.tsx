"use client";

import { useMemo, useState } from "react";
import { ArtisanCard } from "@/components/ArtisanCard";
import type { Artisan } from "@/lib/supabase/types";

export function ArtisanBrowser({
  artisans,
  children,
}: {
  artisans: Artisan[];
  children?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const artisan of artisans) {
      for (const c of artisan.categories ?? []) set.add(c);
    }
    return Array.from(set).sort();
  }, [artisans]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return artisans.filter((artisan) => {
      const matchesCategory =
        !category || (artisan.categories ?? []).includes(category);
      const matchesQuery =
        !q ||
        artisan.name.toLowerCase().includes(q) ||
        artisan.tagline?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [artisans, query, category]);

  return (
    <div>
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-light"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un artisan..."
          className="w-full rounded-full border border-ink/15 bg-white/90 py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-vichy"
        />
      </div>

      {children && <div className="mt-4">{children}</div>}

      {categories.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-xs font-medium transition ${
              category === null
                ? "bg-vichy text-white"
                : "bg-cream-light text-ink-light"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5"
            >
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
            </svg>
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-xs font-medium transition ${
                category === cat
                  ? "bg-vichy text-white"
                  : "bg-cream-light text-ink-light"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.5 12.7-7.8 7.8a1.5 1.5 0 0 1-2.1 0l-6.6-6.6a1.5 1.5 0 0 1-.4-1.1V5.5A1.5 1.5 0 0 1 5.1 4h7.3c.4 0 .8.16 1.1.44l6.9 6.9a1.5 1.5 0 0 1 .1 1.36Z"
                />
                <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
              <span className="line-clamp-1 text-center">{cat}</span>
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-ink-light">Aucun artisan ne correspond.</p>
      )}
    </div>
  );
}
