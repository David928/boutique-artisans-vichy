import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getFeaturedProduct } from "@/lib/featured-product";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { ArtisanCard } from "@/components/ArtisanCard";
import type { Artisan } from "@/lib/supabase/types";

export const revalidate = 3600;

export default async function Home() {
  const supabase = await createClient();
  const [{ data: artisans }, featuredProduct] = await Promise.all([
    supabase
      .from("artisans")
      .select("*")
      .order("name", { ascending: true })
      .returns<Artisan[]>(),
    getFeaturedProduct(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="text-center">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
          La Boutique des Artisans
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-light">
          Des créateurs locaux réunis à Vichy, chacun avec son savoir-faire,
          son histoire et ses créations faites main.
        </p>
      </section>

      {featuredProduct && (
        <section className="mt-10">
          <FeaturedProduct product={featuredProduct} />
        </section>
      )}

      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-ink">Nos artisans</h2>
          <Link href="/artisans" className="text-sm text-vichy hover:underline">
            Tous les artisans
          </Link>
        </div>
        {artisans && artisans.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        ) : (
          <p className="mt-5 text-ink-light">
            Les fiches artisans arrivent bientôt.
          </p>
        )}
      </section>
    </div>
  );
}
