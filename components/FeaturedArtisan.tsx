import Image from "next/image";
import Link from "next/link";
import type { Artisan } from "@/lib/supabase/types";

export function FeaturedArtisan({ artisan }: { artisan: Artisan }) {
  return (
    <Link
      href={`/artisans/${artisan.slug}`}
      className="flex items-center gap-3 overflow-hidden rounded-xl border border-ink/10 bg-cream-light p-3 shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-ink/5">
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
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-vichy">
          Artisan coup de cœur
        </span>
        <h2 className="truncate text-base font-semibold text-ink">
          {artisan.name}
        </h2>
        {artisan.tagline && (
          <p className="truncate text-xs text-ink-light">{artisan.tagline}</p>
        )}
      </div>
    </Link>
  );
}
