import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/supabase/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-ink/10 bg-cream-light shadow-sm transition hover:shadow-md"
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
          <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-ink-light">
            {product.name}
          </div>
        )}
        {!product.is_available && (
          <span className="absolute left-1 top-1 rounded-full bg-ink px-1.5 py-0.5 text-[8px] font-medium text-cream-light">
            Indisponible
          </span>
        )}
      </div>
      <div className="p-1.5">
        <h3 className="truncate text-xs font-semibold text-ink">
          {product.name}
        </h3>
        {product.price != null && (
          <p className="mt-0.5 text-[10px] font-medium text-vichy">
            {product.price.toFixed(2)} €
          </p>
        )}
      </div>
    </Link>
  );
}
