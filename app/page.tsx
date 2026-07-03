import Image from "next/image";
import Link from "next/link";
import { getFeaturedProduct } from "@/lib/featured-product";
import { getFeaturedArtisan } from "@/lib/featured-artisan";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { FeaturedArtisan } from "@/components/FeaturedArtisan";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProduct, featuredArtisan] = await Promise.all([
    getFeaturedProduct(),
    getFeaturedArtisan(),
  ]);

  return (
    <div>
      <div className="border-b border-ink/10 bg-cream-light px-4 pb-6 pt-8 text-center sm:pt-10">
        <Image
          src="/logo.png"
          alt="La Boutique des Artisans Vichy"
          width={420}
          height={190}
          className="mx-auto h-28 w-auto sm:h-36"
          priority
        />
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-light">
          Des créateurs locaux réunis à Vichy, chacun avec son savoir-faire et
          ses créations faites main.
        </p>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 sm:px-6">
        {featuredProduct && <FeaturedProduct product={featuredProduct} />}
        {featuredArtisan && <FeaturedArtisan artisan={featuredArtisan} />}

        <Link
          href="/artisans"
          className="mt-2 block rounded-full bg-ink py-3 text-center text-sm font-medium text-cream-light transition hover:bg-ink-light"
        >
          Voir tous les artisans
        </Link>
      </div>
    </div>
  );
}
