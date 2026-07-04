import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { AnnouncementWithArtisan } from "@/lib/supabase/types";

export const revalidate = 60;

export const metadata = {
  title: "Nouveautés — La Boutique des Artisans Vichy",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

export default async function NouveautesPage() {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*, artisan:artisans(slug, name)")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false })
    .returns<AnnouncementWithArtisan[]>();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Nouveautés</h1>
      <p className="mt-1 text-sm text-ink-light">
        Promotions, événements et annonces de la boutique et de ses
        artisans.
      </p>

      {announcements && announcements.length > 0 ? (
        <div className="mt-5 flex flex-col gap-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="overflow-hidden rounded-xl border border-ink/10 bg-cream-light"
            >
              {a.image_url && (
                <div className="relative aspect-[16/9] w-full bg-ink/5">
                  <Image
                    src={a.image_url}
                    alt={a.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-ink-light">
                  <span>
                    {a.artisan ? (
                      <>
                        Par{" "}
                        <Link
                          href={`/artisans/${a.artisan.slug}`}
                          className="font-medium text-vichy hover:underline"
                        >
                          {a.artisan.name}
                        </Link>
                      </>
                    ) : (
                      <span className="font-medium text-vichy">
                        La Boutique des Artisans
                      </span>
                    )}
                  </span>
                  <span>{formatDate(a.created_at)}</span>
                </div>
                <h2 className="mt-1 text-base font-semibold text-ink">
                  {a.title}
                </h2>
                {a.description && (
                  <p className="mt-1 whitespace-pre-line text-sm text-ink-light">
                    {a.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-ink-light">
          Aucune nouveauté pour l&apos;instant — revenez bientôt !
        </p>
      )}
    </div>
  );
}
