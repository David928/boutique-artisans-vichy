import { createClient } from "@/lib/supabase/server";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { PushSubscribeButton } from "@/components/PushSubscribeButton";
import type { AnnouncementWithArtisan } from "@/lib/supabase/types";

export const revalidate = 60;

export const metadata = {
  title: "Nouveautés — La Boutique des Artisans Vichy",
};

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

      <div className="mt-5">
        <PushSubscribeButton />
      </div>

      {announcements && announcements.length > 0 ? (
        <div className="mt-5 flex flex-col gap-3">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
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
