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

async function uploadImageIfProvided(
  artisanSlug: string,
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const supabase = await createClient();
  const path = `${artisanSlug}/${Date.now()}-${slugify(file.name)}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

export async function updateArtisanProfile(formData: FormData) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();

  const photoFile = formData.get("photo") as File | null;
  const photo_url = await uploadImageIfProvided(artisan.slug, photoFile);

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
  const imageFile = formData.get("image") as File | null;
  const image_url = await uploadImageIfProvided(artisan.slug, imageFile);

  const { error } = await supabase.from("products").insert({
    artisan_id: artisan.id,
    slug,
    name,
    description: String(formData.get("description") ?? "") || null,
    price: formData.get("price") ? Number(formData.get("price")) : null,
    is_available: formData.get("is_available") === "on",
    image_url,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath(`/artisans/${artisan.slug}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(productId: string, formData: FormData) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const supabase = await createClient();
  const imageFile = formData.get("image") as File | null;
  const image_url = await uploadImageIfProvided(artisan.slug, imageFile);

  const { error } = await supabase
    .from("products")
    .update({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      is_available: formData.get("is_available") === "on",
      ...(image_url ? { image_url } : {}),
    })
    .eq("id", productId)
    .eq("artisan_id", artisan.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath(`/artisans/${artisan.slug}`);
  revalidatePath("/");
  redirect("/admin");
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
