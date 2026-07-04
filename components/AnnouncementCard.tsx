import Image from "next/image";
import Link from "next/link";
import type { AnnouncementWithArtisan } from "@/lib/supabase/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

export function AnnouncementCard({
  announcement,
  showArtisan = true,
}: {
  announcement: AnnouncementWithArtisan;
  showArtisan?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-cream-light">
      {announcement.image_url && (
        <div className="relative aspect-[16/9] w-full bg-ink/5">
          <Image
            src={announcement.image_url}
            alt={announcement.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-ink-light">
          {showArtisan ? (
            <span>
              {announcement.artisan ? (
                <>
                  Par{" "}
                  <Link
                    href={`/artisans/${announcement.artisan.slug}`}
                    className="font-medium text-vichy hover:underline"
                  >
                    {announcement.artisan.name}
                  </Link>
                </>
              ) : (
                <span className="font-medium text-vichy">
                  La Boutique des Artisans
                </span>
              )}
            </span>
          ) : (
            <span />
          )}
          <span>{formatDate(announcement.created_at)}</span>
        </div>
        <h2 className="mt-1 text-base font-semibold text-ink">
          {announcement.title}
        </h2>
        {announcement.description && (
          <p className="mt-1 whitespace-pre-line text-sm text-ink-light">
            {announcement.description}
          </p>
        )}
      </div>
    </div>
  );
}
