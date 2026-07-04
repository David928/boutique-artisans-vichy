import { redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { AnnouncementForm } from "@/components/AnnouncementForm";

export const metadata = {
  title: "Nouvelle annonce — La Boutique des Artisans Vichy",
};

export default async function NewAnnouncementPage() {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">Nouvelle annonce</h1>
      <p className="mt-1 text-sm text-ink-light">
        Promo, nouveauté, événement... elle apparaîtra sur l&apos;onglet
        Nouveautés.
      </p>
      <AnnouncementForm artisanSlug={artisan.slug} />
    </div>
  );
}
