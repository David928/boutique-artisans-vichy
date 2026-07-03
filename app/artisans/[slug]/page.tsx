import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/ProductGrid";
import type { Artisan, Product } from "@/lib/supabase/types";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: artisan } = await supabase
    .from("artisans")
    .select("name, tagline, photo_url")
    .eq("slug", slug)
    .maybeSingle();

  if (!artisan) return {};
  const title = `${artisan.name} — La Boutique des Artisans Vichy`;
  const description = artisan.tagline ?? undefined;
  const images = artisan.photo_url ? [artisan.photo_url] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ArtisanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: artisan } = await supabase
    .from("artisans")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Artisan>();

  if (!artisan) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("artisan_id", artisan.id)
    .order("created_at", { ascending: false })
    .returns<Product[]>();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-ink/5 sm:h-28 sm:w-28">
          {artisan.photo_url ? (
            <Image
              src={artisan.photo_url}
              alt={artisan.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-ink-light">
              {artisan.name}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">
            {artisan.name}
          </h1>
          {artisan.tagline && (
            <p className="mt-0.5 text-sm text-vichy">{artisan.tagline}</p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-light">
            {artisan.email && <span>{artisan.email}</span>}
            {artisan.phone && <span>{artisan.phone}</span>}
            {artisan.website && (
              <a
                href={artisan.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-vichy hover:underline"
              >
                {artisan.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      {artisan.story && (
        <p className="mt-4 whitespace-pre-line text-sm text-ink-light">
          {artisan.story}
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ink">
          Créations de {artisan.name}
        </h2>
        {products && products.length > 0 ? (
          <div className="mt-3">
            <ProductGrid products={products} limit={8} />
          </div>
        ) : (
          <p className="mt-3 text-ink-light">
            Les fiches produits arrivent bientôt.
          </p>
        )}
      </section>
    </div>
  );
}
