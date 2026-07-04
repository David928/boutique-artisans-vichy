import Image from "next/image";
import Link from "next/link";
import { getFeaturedProduct } from "@/lib/featured-product";
import { getFeaturedArtisan } from "@/lib/featured-artisan";
import { getLatestProduct } from "@/lib/latest-product";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { FeaturedArtisan } from "@/components/FeaturedArtisan";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestProduct = await getLatestProduct();
  const [featuredProduct, featuredArtisan] = await Promise.all([
    getFeaturedProduct(latestProduct?.id),
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
          La Boutique des Artisans réunit des créateurs locaux à Vichy,
          chacun avec son savoir-faire et ses créations faites main.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-light">
          Explorez ici leurs univers, leurs nouveautés et leurs plus belles
          pièces — avant de venir les rencontrer en boutique.
        </p>
        <Link
          href="/infos"
          className="mt-3 inline-block text-xs font-medium text-vichy hover:underline"
        >
          ℹ️ Infos pratiques (adresse, horaires...)
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        {latestProduct && (
          <section>
            <h2 className="text-lg font-semibold text-ink">
              🆕 Dernier objet en boutique
            </h2>
            <p className="mt-0.5 text-xs text-ink-light">
              Le tout dernier ajouté par nos artisans.
            </p>
            <div className="mt-3">
              <FeaturedProduct
                product={latestProduct}
                label="Nouveau en boutique"
              />
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-ink">
            ✨ Coup de cœur du moment
          </h2>
          <p className="mt-0.5 text-xs text-ink-light">
            Un nouveau produit et un nouvel artisan à chaque ouverture de
            l&apos;application.
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {featuredProduct && <FeaturedProduct product={featuredProduct} />}
            {featuredArtisan && <FeaturedArtisan artisan={featuredArtisan} />}
          </div>
        </section>

        <Link
          href="/nouveautes"
          className="mt-6 block rounded-full bg-ink py-3 text-center text-sm font-medium text-cream-light transition hover:bg-ink-light"
        >
          📣 Voir toutes les nouveautés et promos
        </Link>
      </div>
    </div>
  );
}
