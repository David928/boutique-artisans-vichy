"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { computeExpiresAt } from "@/lib/announcement-expiry";
import { sendPushToAll } from "@/lib/push";

export async function createBoutiqueAnnouncement(formData: FormData) {
  if (!(await isSuperAdmin())) redirect("/admin");

  const admin = createAdminClient();
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "");

  const { error } = await admin.from("announcements").insert({
    artisan_id: null,
    title,
    description: String(formData.get("description") ?? "") || null,
    image_url,
    expires_at: computeExpiresAt(formData.get("expires_at")),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/annonces-boutique");
  revalidatePath("/nouveautes");

  sendPushToAll({
    title: "La Boutique des Artisans",
    body: title,
    url: "/nouveautes",
  }).catch(() => {});
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
