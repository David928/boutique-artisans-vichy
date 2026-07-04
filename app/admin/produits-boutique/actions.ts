"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdmin } from "@/lib/is-superadmin";

export async function deleteProductAsAdmin(productId: string) {
  if (!(await isSuperAdmin())) redirect("/admin");

  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produits-boutique");
  revalidatePath("/artisans");
  revalidatePath("/");
}

export async function toggleProductAvailabilityAsAdmin(
  productId: string,
  isAvailable: boolean
) {
  if (!(await isSuperAdmin())) redirect("/admin");

  const admin = createAdminClient();
  const { error } = await admin
    .from("products")
    .update({ is_available: isAvailable })
    .eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produits-boutique");
  revalidatePath("/artisans");
  revalidatePath("/");
}
