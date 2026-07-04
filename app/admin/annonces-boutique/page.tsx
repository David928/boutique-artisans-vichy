import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createClient } from "@/lib/supabase/server";
import { BoutiqueAnnouncementForm } from "@/components/BoutiqueAnnouncementForm";
import { deleteBoutiqueAnnouncement } from "@/app/admin/annonces-boutique/actions";
import type { Announcement } from "@/lib/supabase/types";

export const metadata = {
  title: "Annonces de la boutique — La Boutique des Artisans Vichy",
};

export default async function AdminBoutiqueAnnouncementsPage() {
  if (!(await isSuperAdmin())) redirect("/admin");

  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .is("artisan_id", null)
    .order("created_at", { ascending: false })
    .returns<Announcement[]>();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">
        Annonces de la boutique
      </h1>
      <p className="mt-1 text-sm text-ink-light">
        Annonces générales (pas liées à un artisan en particulier), visibles
        sur l&apos;onglet Nouveautés.
      </p>

      <div className="mt-6">
        <BoutiqueAnnouncementForm uploadFolderSlug={artisan.slug} />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ink">Annonces publiées</h2>
        {announcements && announcements.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-3">
            {announcements.map((announcement) => (
              <li
                key={announcement.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-cream-light px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{announcement.title}</p>
                  {announcement.expires_at && (
                    <p className="text-sm text-ink-light">
                      Jusqu&apos;au{" "}
                      {new Date(announcement.expires_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  )}
                </div>
                <form
                  action={async () => {
                    "use server";
                    await deleteBoutiqueAnnouncement(announcement.id);
                  }}
                  className="shrink-0"
                >
                  <button
                    type="submit"
                    className="text-sm text-red-700 hover:underline"
                  >
                    Supprimer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-ink-light">
            Aucune annonce boutique pour l&apos;instant.
          </p>
        )}
      </section>
    </div>
  );
}
