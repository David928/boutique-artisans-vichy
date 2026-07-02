import Image from "next/image";
import Link from "next/link";
import type { ProductWithArtisan } from "@/lib/supabase/types";

export function FeaturedProduct({ product }: { product: ProductWithArtisan }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-cream-light shadow-sm">
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="relative aspect-square w-full bg-ink/5 sm:aspect-auto">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center px-4 text-center text-ink-light">
              {product.name}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-3 p-6 sm:p-10">
          <span className="w-fit rounded-full bg-vichy/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-vichy">
            Produit du jour
          </span>
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
            {product.name}
          </h2>
          <p className="text-sm text-ink-light">
            par{" "}
            <Link
              href={`/artisans/${product.artisan.slug}`}
              className="font-medium text-vichy hover:underline"
            >
              {product.artisan.name}
            </Link>
          </p>
          {product.description && (
            <p className="text-ink-light">{product.description}</p>
          )}
          <div className="mt-2 flex items-center gap-4">
            {product.price != null && (
              <span className="text-xl font-semibold text-ink">
                {product.price.toFixed(2)} €
              </span>
            )}
            <Link
              href={`/produits/${product.slug}`}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light"
            >
              Voir la fiche produit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
