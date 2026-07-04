"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdmin } from "@/lib/is-superadmin";

function parseExpiresAt(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  if (!str) return null;
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

export async function createBoutiqueAnnouncement(formData: FormData) {
  if (!(await isSuperAdmin())) redirect("/admin");

  const admin = createAdminClient();
  const image_url = String(formData.get("image_url") ?? "").trim() || null;

  const { error } = await admin.from("announcements").insert({
    artisan_id: null,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    image_url,
    expires_at: parseExpiresAt(formData.get("expires_at")),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/annonces-boutique");
  revalidatePath("/nouveautes");
}

export async function deleteBoutiqueAnnouncement(announcementId: string) {
  if (!(await isSuperAdmin())) redirect("/admin");

  const admin = createAdminClient();
  const { error } = await admin
    .from("announcements")
    .delete()
    .eq("id", announcementId)
    .is("artisan_id", null);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/annonces-boutique");
  revalidatePath("/nouveautes");
}
