import { notFound, redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import type { Announcement } from "@/lib/supabase/types";

export const metadata = {
  title: "Modifier l'annonce — La Boutique des Artisans Vichy",
};

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const { id } = await params;
  const supabase = await createClient();
  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .eq("artisan_id", artisan.id)
    .maybeSingle<Announcement>();

  if (!announcement) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">
        Modifier « {announcement.title} »
      </h1>
      <AnnouncementForm
        artisanSlug={artisan.slug}
        announcement={announcement}
      />
    </div>
  );
}
