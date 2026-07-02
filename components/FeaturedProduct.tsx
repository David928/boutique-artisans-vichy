import Image from "next/image";
import Link from "next/link";
import type { ProductWithArtisan } from "@/lib/supabase/types";

export function FeaturedProduct({ product }: { product: ProductWithArtisan }) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="flex items-center gap-3 overflow-hidden rounded-xl border border-ink/10 bg-cream-light p-3 shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ink/5">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-ink-light">
            {product.name}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-vichy">
          Produit du jour
        </span>
        <h2 className="truncate text-base font-semibold text-ink">
          {product.name}
        </h2>
        <p className="truncate text-xs text-ink-light">
          par {product.artisan.name}
        </p>
        {product.price != null && (
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {product.price.toFixed(2)} €
          </p>
        )}
      </div>
    </Link>
  );
}
