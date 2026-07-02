import { createClient } from "@/lib/supabase/server";
import type { Artisan } from "@/lib/supabase/types";

/** Récupère l'artisan lié au compte actuellement connecté (via profiles), ou null. */
export async function getCurrentArtisan(): Promise<Artisan | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("artisan_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return null;

  const { data: artisan } = await supabase
    .from("artisans")
    .select("*")
    .eq("id", profile.artisan_id)
    .maybeSingle<Artisan>();

  return artisan;
}
