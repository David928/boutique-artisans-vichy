import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
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
    .select("name, tagline")
    .eq("slug", slug)
    .maybeSingle();

  if (!artisan) return {};
  return {
    title: `${artisan.name} — La Boutique des Artisans Vichy`,
    description: artisan.tagline ?? undefined,
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,260px)_1fr]">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ink/5">
          {artisan.photo_url ? (
            <Image
              src={artisan.photo_url}
              alt={artisan.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-light">
              {artisan.name}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-ink">{artisan.name}</h1>
          {artisan.tagline && (
            <p className="mt-1 text-vichy">{artisan.tagline}</p>
          )}
          {artisan.story && (
            <p className="mt-4 whitespace-pre-line text-ink-light">
              {artisan.story}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-light">
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

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-ink">
          Créations de {artisan.name}
        </h2>
        {products && products.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-5 text-ink-light">
            Les fiches produits arrivent bientôt.
          </p>
        )}
      </section>
    </div>
  );
}
