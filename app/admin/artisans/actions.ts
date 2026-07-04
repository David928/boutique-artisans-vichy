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
