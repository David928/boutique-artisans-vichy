import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getFeaturedProduct } from "@/lib/featured-product";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { ArtisanBrowser } from "@/components/ArtisanBrowser";
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
    <div>
      <div className="border-b border-ink/10 bg-cream-light px-4 pb-6 pt-8 text-center sm:pt-10">
        <Image
          src="/logo.png"
          alt="La Boutique des Artisans Vichy"
          width={320}
          height={160}
          className="mx-auto h-24 w-auto sm:h-32"
          priority
        />
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-light">
          Des créateurs locaux réunis à Vichy, chacun avec son savoir-faire et
          ses créations faites main.
        </p>

        <div className="mx-auto mt-4 max-w-xs rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-left text-sm text-ink-light">
          <p className="font-semibold text-ink">Retrouvez-nous :</p>
          <p className="mt-1">
            📍 Centre Commercial Les 4 Chemins
            <br />
            35 rue Lucas
            <br />
            03200 Vichy
          </p>
          <p className="mt-2 font-semibold text-ink">
            🕒 Nos horaires d&apos;ouverture :
          </p>
          <ul className="mt-1 space-y-0.5">
            <li>• Lundi : 14h00 à 19h00</li>
            <li>• Mardi au samedi : 9h30 à 19h00</li>
            <li>• Dimanche : 14h30 à 19h00</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <ArtisanBrowser artisans={artisans ?? []}>
          {featuredProduct && <FeaturedProduct product={featuredProduct} />}
        </ArtisanBrowser>
      </div>
    </div>
  );
}
