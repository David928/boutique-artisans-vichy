import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createClient } from "@/lib/supabase/server";
import { getActiveAnnouncement } from "@/lib/announcement-expiry";
import { AnnouncementForm } from "@/components/AnnouncementForm";

export const metadata = {
  title: "Nouvelle annonce — La Boutique des Artisans Vichy",
};

export default async function NewAnnouncementPage() {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const existing = await getActiveAnnouncement(supabase, artisan.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">Nouvelle annonce</h1>
      <p className="mt-1 text-sm text-ink-light">
        Promo, nouveauté, événement... elle apparaîtra sur l&apos;onglet
        Nouveautés.
      </p>

      {existing ? (
        <div className="mt-6 rounded-xl border border-ink/10 bg-cream-light px-4 py-3 text-sm text-ink">
          Vous avez déjà une annonce en ligne : « {existing.title} ». Une
          seule annonce à la fois par artisan — modifiez-la ou supprimez-la
          avant d&apos;en publier une nouvelle.
          <div className="mt-3 flex gap-4">
            <Link
              href={`/admin/annonces/${existing.id}`}
              className="text-vichy hover:underline"
            >
              Modifier mon annonce
            </Link>
            <Link href="/admin" className="text-ink-light hover:underline">
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      ) : (
        <AnnouncementForm artisanSlug={artisan.slug} />
      )}
    </div>
  );
}
