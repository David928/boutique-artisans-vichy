import { createClient } from "@/lib/supabase/server";
import type { Artisan } from "@/lib/supabase/types";

/**
 * Choisit un artisan mis en avant au hasard, à chaque visite de l'accueil
 * (voir `getFeaturedProduct` pour le même principe côté produits).
 */
export async function getFeaturedArtisan(): Promise<Artisan | null> {
  const supabase = await createClient();

  const { data: artisans } = await supabase.from("artisans").select("*");

  if (!artisans || artisans.length === 0) return null;

  const index = Math.floor(Math.random() * artisans.length);

  return artisans[index] as Artisan;
}
