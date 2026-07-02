"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream-light/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-3 sm:justify-start sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="La Boutique des Artisans Vichy"
            width={160}
            height={80}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
