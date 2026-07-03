"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { getFavorites, subscribeFavorites } from "@/lib/favorites";
import type { Product } from "@/lib/supabase/types";

export default function FavorisPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const ids = getFavorites();
      if (ids.length === 0) {
        if (!cancelled) setProducts([]);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .in("id", ids)
        .returns<Product[]>();
      if (!cancelled) setProducts(data ?? []);
    }

    load();
    const unsubscribe = subscribeFavorites(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Mes favoris</h1>
      <p className="mt-1 text-sm text-ink-light">
        Les produits que vous avez mis de côté, enregistrés sur cet appareil.
      </p>

      {products === null ? null : products.length > 0 ? (
        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-ink-light">
          Aucun favori pour l&apos;instant. Touchez le cœur sur une fiche
          produit pour l&apos;ajouter ici.
        </p>
      )}
    </div>
  );
}
