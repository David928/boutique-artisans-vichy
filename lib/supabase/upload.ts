"use client";

import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";

/**
 * Upload direct navigateur → Supabase Storage (contourne la limite de
 * taille de requête des Server Actions Next.js/Vercel pour les photos).
 */
export async function uploadImageClient(
  artisanSlug: string,
  file: File
): Promise<string> {
  const supabase = createClient();
  const path = `${artisanSlug}/${Date.now()}-${slugify(file.name)}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}
