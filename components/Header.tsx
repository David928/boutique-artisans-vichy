import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-ink/10 bg-cream-light">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="La Boutique des Artisans Vichy"
            width={160}
            height={80}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-ink sm:gap-6 sm:text-base">
          <Link href="/" className="hover:text-vichy">
            Accueil
          </Link>
          <Link href="/artisans" className="hover:text-vichy">
            Nos artisans
          </Link>
        </nav>
      </div>
    </header>
  );
}
