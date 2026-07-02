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
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              category === null
                ? "bg-ink text-cream-light"
                : "bg-cream-light text-ink-light"
            }`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === cat
                  ? "bg-ink text-cream-light"
                  : "bg-cream-light text-ink-light"
              }`}
            >
              {cat}
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
