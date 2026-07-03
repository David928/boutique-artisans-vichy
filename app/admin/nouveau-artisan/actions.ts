"use server";

import { randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { slugify } from "@/lib/slugify";

export type CreateArtisanState = {
  error?: string;
  success?: {
    name: string;
    slug: string;
    email: string;
    password: string;
  };
};

function generatePassword(): string {
  return randomBytes(9).toString("base64url");
}

export async function createArtisanWithAccount(
  _prevState: CreateArtisanState,
  formData: FormData
): Promise<CreateArtisanState> {
  if (!(await isSuperAdmin())) {
    return { error: "Accès refusé." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const tagline = String(formData.get("tagline") ?? "").trim() || null;
  const categories = formData.getAll("categories").map(String);
  const slugInput = String(formData.get("slug") ?? "").trim();

  if (!name || !email) {
    return { error: "Le nom et l'email sont obligatoires." };
  }

  const slug = slugify(slugInput || name);
  if (!slug) {
    return { error: "Impossible de générer un identifiant à partir du nom." };
  }

  const admin = createAdminClient();
  const password = generatePassword();

  const { data: userData, error: userError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (userError || !userData.user) {
    return {
      error: userError?.message ?? "Impossible de créer le compte.",
    };
  }

  // Tout échec à partir d'ici (y compris une exception imprévue) doit
  // supprimer le compte auth déjà créé pour éviter un compte orphelin.
  try {
    const { data: artisan, error: artisanError } = await admin
      .from("artisans")
      .insert({ slug, name, tagline, categories })
      .select("id")
      .single();

    if (artisanError || !artisan) {
      throw new Error(
        artisanError?.message ??
          "Impossible de créer la fiche artisan (slug déjà utilisé ?)."
      );
    }

    const { error: profileError } = await admin.from("profiles").insert({
      id: userData.user.id,
      artisan_id: artisan.id,
    });

    if (profileError) {
      await admin.from("artisans").delete().eq("id", artisan.id);
      throw new Error(profileError.message);
    }

    return { success: { name, slug, email, password } };
  } catch (err) {
    await admin.auth.admin.deleteUser(userData.user.id).catch(() => {});
    return {
      error: err instanceof Error ? err.message : "Une erreur est survenue.",
    };
  }
}
