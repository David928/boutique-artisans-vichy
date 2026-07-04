"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { computeExpiresAt } from "@/lib/announcement-expiry";

export async function createAnnouncement(formData: FormData) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const image_url = String(formData.get("image_url") ?? "").trim() || null;

  const { error } = await supabase.from("announcements").insert({
    artisan_id: artisan.id,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    image_url,
    expires_at: computeExpiresAt(formData.get("expires_at")),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/nouveautes");
}

export async function updateAnnouncement(
  announcementId: string,
  formData: FormData
) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const image_url = String(formData.get("image_url") ?? "").trim() || null;

  const { error } = await supabase
    .from("announcements")
    .update({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      expires_at: computeExpiresAt(formData.get("expires_at")),
      ...(image_url ? { image_url } : {}),
    })
    .eq("id", announcementId)
    .eq("artisan_id", artisan.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/nouveautes");
}

export async function deleteAnnouncement(announcementId: string) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId)
    .eq("artisan_id", artisan.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/nouveautes");
}
