"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArtisanCard } from "@/components/ArtisanCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { Artisan } from "@/lib/supabase/types";

export function ArtisanBrowser({
  artisans,
  children,
  limit,
}: {
  artisans: Artisan[];
  children?: React.ReactNode;
  limit?: number;
}) {
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const artisan of artisans) {
      for (const c of artisan.categories ?? []) set.add(c);
    }
    return Array.from(set).sort();
  }, [artisans]);

  const filtered = useMemo(() => {
    return artisans.filter(
      (artisan) => !category || (artisan.categories ?? []).includes(category)
    );
  }, [artisans, category]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      {children}

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
              <CategoryIcon category={cat} />
              <span className="line-clamp-1 text-center">{cat}</span>
            </button>
          ))}
        </div>
      )}

      {visible.length > 0 ? (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {visible.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-ink-light">Aucun artisan ne correspond.</p>
      )}

      {limit && filtered.length > limit && (
        <Link
          href="/artisans"
          className="mt-4 block rounded-full border border-ink/15 py-2.5 text-center text-sm font-medium text-ink transition hover:bg-cream-light"
        >
          Voir tous les artisans ({filtered.length})
        </Link>
      )}
    </div>
  );
}
