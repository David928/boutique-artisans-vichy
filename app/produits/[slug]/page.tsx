import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/ProductGallery";
import type { ProductWithArtisan } from "@/lib/supabase/types";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description, image_url")
    .eq("slug", slug)
    .maybeSingle();

  if (!product) return {};
  const title = `${product.name} — La Boutique des Artisans Vichy`;
  const description = product.description ?? undefined;
  const images = product.image_url ? [product.image_url] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, artisan:artisans(slug, name)")
    .eq("slug", slug)
    .maybeSingle<ProductWithArtisan>();

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <ProductGallery
            images={
              product.images?.length ? product.images : product.image_url ? [product.image_url] : []
            }
            name={product.name}
          />
        </div>
        <div>
          {!product.is_available && (
            <span className="mb-2 inline-block rounded-full bg-ink px-3 py-1 text-xs font-medium text-cream-light">
              Indisponible
            </span>
          )}
          <h1 className="text-3xl font-semibold text-ink">{product.name}</h1>
          <p className="mt-1 text-sm text-ink-light">
            par{" "}
            <Link
              href={`/artisans/${product.artisan.slug}`}
              className="font-medium text-vichy hover:underline"
            >
              {product.artisan.name}
            </Link>
          </p>
          {product.price != null && (
            <p className="mt-4 text-2xl font-semibold text-ink">
              {product.price.toFixed(2)} €
            </p>
          )}
          {product.description && (
            <p className="mt-4 whitespace-pre-line text-ink-light">
              {product.description}
            </p>
          )}
          <Link
            href={`/artisans/${product.artisan.slug}`}
            className="mt-6 inline-block rounded-full border border-ink/20 px-5 py-2 text-sm font-medium text-ink transition hover:bg-ink/5"
          >
            Voir tous les produits de {product.artisan.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
