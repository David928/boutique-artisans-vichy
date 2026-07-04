"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdmin } from "@/lib/is-superadmin";

export async function updateArtisanAsAdmin(
  artisanId: string,
  slug: string,
  formData: FormData
) {
  if (!(await isSuperAdmin())) redirect("/admin");

  const admin = createAdminClient();
  const photo_url = String(formData.get("photo_url") ?? "").trim() || null;

  const { error } = await admin
    .from("artisans")
    .update({
      tagline: String(formData.get("tagline") ?? ""),
      categories: formData.getAll("categories").map(String),
      story: String(formData.get("story") ?? ""),
      email: String(formData.get("email") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      website: String(formData.get("website") ?? "") || null,
      ...(photo_url ? { photo_url } : {}),
    })
    .eq("id", artisanId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/artisans");
  revalidatePath(`/artisans/${slug}`);
  revalidatePath("/");
}

export async function deleteArtisanAsAdmin(artisanId: string) {
  if (!(await isSuperAdmin())) redirect("/admin");

  const admin = createAdminClient();

  // Le compte de connexion (auth.users) n'est pas supprimé automatiquement
  // par la suppression de la fiche artisan (seule la ligne "profiles" l'est,
  // via la contrainte on delete cascade) — on le récupère avant de supprimer.
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("artisan_id", artisanId)
    .maybeSingle();

  const { error } = await admin.from("artisans").delete().eq("id", artisanId);
  if (error) throw new Error(error.message);

  if (profile) {
    await admin.auth.admin.deleteUser(profile.id).catch(() => {});
  }

  revalidatePath("/admin/artisans");
  revalidatePath("/artisans");
  revalidatePath("/");
  redirect("/admin/artisans");
}
