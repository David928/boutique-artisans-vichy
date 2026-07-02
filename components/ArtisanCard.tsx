import Image from "next/image";
import Link from "next/link";
import type { Artisan } from "@/lib/supabase/types";

export function ArtisanCard({ artisan }: { artisan: Artisan }) {
  return (
    <Link
      href={`/artisans/${artisan.slug}`}
      className="group block overflow-hidden rounded-lg border border-ink/10 bg-cream-light shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-ink/5">
        {artisan.photo_url ? (
          <Image
            src={artisan.photo_url}
            alt={artisan.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-ink-light">
            {artisan.name}
          </div>
        )}
      </div>
      <div className="p-1.5">
        <h3 className="truncate text-xs font-semibold text-ink">
          {artisan.name}
        </h3>
        {artisan.tagline && (
          <p className="mt-0.5 truncate text-[10px] text-ink-light">
            {artisan.tagline}
          </p>
        )}
      </div>
    </Link>
  );
}
