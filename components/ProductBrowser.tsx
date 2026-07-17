"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { ProductWithArtisan } from "@/lib/supabase/types";

export function ProductBrowser({
  products,
}: {
  products: ProductWithArtisan[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.artisan.name.toLowerCase().includes(q)
    );
  }, [products, query]);

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
          placeholder="Rechercher un produit ou un artisan..."
          className="w-full rounded-full border border-ink/15 bg-white/90 py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-vichy"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-ink-light">Aucun produit ne correspond.</p>
      )}
    </div>
  );
}
