"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { slugify } from "@/lib/slugify";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(formData: FormData) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    redirect(
      `/admin?pwError=${encodeURIComponent(
        "Le mot de passe doit contenir au moins 6 caractères."
      )}`
    );
  }
  if (password !== confirm) {
    redirect(
      `/admin?pwError=${encodeURIComponent(
        "Les deux mots de passe ne correspondent pas."
      )}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/admin?pwError=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin?pwSuccess=1");
}

export async function updateArtisanProfile(formData: FormData) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();

  const photo_url = String(formData.get("photo_url") ?? "").trim() || null;

  const { error } = await supabase
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
    .eq("id", artisan.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath(`/artisans/${artisan.slug}`);
  revalidatePath("/");
}

export async function createProduct(formData: FormData) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const name = String(formData.get("name") ?? "");
  const slug = `${slugify(name)}-${Date.now().toString(36)}`;
  const images = formData.getAll("image_urls").map(String).filter(Boolean);

  const { error } = await supabase.from("products").insert({
    artisan_id: artisan.id,
    slug,
    name,
    description: String(formData.get("description") ?? "") || null,
    price: formData.get("price") ? Number(formData.get("price")) : null,
    is_available: formData.get("is_available") === "on",
    image_url: images[0] ?? null,
    images,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath(`/artisans/${artisan.slug}`);
  revalidatePath("/");
}

export async function updateProduct(productId: string, formData: FormData) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const images = formData.getAll("image_urls").map(String).filter(Boolean);

  const { error } = await supabase
    .from("products")
    .update({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      is_available: formData.get("is_available") === "on",
      ...(images.length > 0 ? { image_url: images[0], images } : {}),
    })
    .eq("id", productId)
    .eq("artisan_id", artisan.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath(`/artisans/${artisan.slug}`);
  revalidatePath("/");
}

export async function deleteProduct(productId: string) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("artisan_id", artisan.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath(`/artisans/${artisan.slug}`);
  revalidatePath("/");
}
