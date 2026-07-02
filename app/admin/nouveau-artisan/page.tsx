import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { NewArtisanForm } from "@/app/admin/nouveau-artisan/NewArtisanForm";

export const metadata = {
  title: "Ajouter un artisan — La Boutique des Artisans Vichy",
};

export default async function NewArtisanPage() {
  if (!(await isSuperAdmin())) redirect("/admin");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">Ajouter un artisan</h1>
      <p className="mt-1 text-sm text-ink-light">
        Crée sa fiche et son compte de connexion en une fois.
      </p>

      <div className="mt-6">
        <NewArtisanForm />
      </div>
    </div>
  );
}
