"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/supabase/types";

export function ProductGrid({
  products,
  limit,
}: {
  products: Product[];
  limit?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const showAll = expanded || !limit || products.length <= limit;
  const visible = showAll ? products : products.slice(0, limit);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {!showAll && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 w-full rounded-full border border-ink/15 py-2.5 text-center text-sm font-medium text-ink transition hover:bg-cream-light"
        >
          Voir tous les produits ({products.length})
        </button>
      )}
    </div>
  );
}
