import { notFound, redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { createClient } from "@/lib/supabase/server";
import { AdminArtisanForm } from "@/components/AdminArtisanForm";
import { DeleteArtisanButton } from "@/components/DeleteArtisanButton";
import type { Artisan } from "@/lib/supabase/types";

export const metadata = {
  title: "Modifier un artisan — La Boutique des Artisans Vichy",
};

export default async function AdminEditArtisanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isSuperAdmin())) redirect("/admin");

  const { id } = await params;
  const supabase = await createClient();
  const { data: artisan } = await supabase
    .from("artisans")
    .select("*")
    .eq("id", id)
    .maybeSingle<Artisan>();

  if (!artisan) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">
        Modifier « {artisan.name} »
      </h1>
      <AdminArtisanForm artisan={artisan} />

      <div className="mt-8 border-t border-ink/10 pt-6">
        <DeleteArtisanButton artisanId={artisan.id} artisanName={artisan.name} />
      </div>
    </div>
  );
}
