import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Page introuvable — La Boutique des Artisans Vichy",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:px-6">
      <Image
        src="/logo.png"
        alt="La Boutique des Artisans — Vichy"
        width={160}
        height={90}
        className="rounded-lg"
      />
      <h1 className="mt-8 text-2xl font-semibold text-ink">
        Page introuvable
      </h1>
      <p className="mt-2 text-sm text-ink-light">
        Cette page n&apos;existe pas ou plus — l&apos;artisan ou le produit a
        peut-être changé d&apos;adresse.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-vichy px-5 py-2 text-sm font-medium text-white transition hover:bg-vichy-light"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/artisans"
          className="rounded-full border border-ink/15 bg-cream-light px-5 py-2 text-sm font-medium text-ink transition hover:border-ink/30"
        >
          Voir tous les artisans
        </Link>
      </div>
    </div>
  );
}
