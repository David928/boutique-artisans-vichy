import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/supabase/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-cream-light shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-ink/5">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-ink-light">
            {product.name}
          </div>
        )}
        {!product.is_available && (
          <span className="absolute left-2 top-2 rounded-full bg-ink px-3 py-1 text-xs font-medium text-cream-light">
            Indisponible
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink">{product.name}</h3>
        {product.price != null && (
          <p className="mt-1 text-sm text-vichy">
            {product.price.toFixed(2)} €
          </p>
        )}
      </div>
    </Link>
  );
}
