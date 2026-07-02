import { createClient } from "@/lib/supabase/server";
import type { ProductWithArtisan } from "@/lib/supabase/types";

/** Hash simple et déterministe (FNV-1a) pour transformer une chaîne en entier positif. */
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Choisit un produit "du jour" de façon déterministe à partir de la date du
 * jour : même produit pour tout le monde sur une journée donnée, et rotation
 * automatique le lendemain sans action manuelle. `dateOverride` permet de
 * tester la rotation avec une autre date.
 */
export async function getFeaturedProduct(
  dateOverride?: string
): Promise<ProductWithArtisan | null> {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, artisan:artisans(slug, name)")
    .eq("is_available", true)
    .order("id", { ascending: true });

  if (!products || products.length === 0) return null;

  const today = dateOverride ?? new Date().toISOString().slice(0, 10);
  const index = hashString(today) % products.length;

  return products[index] as ProductWithArtisan;
}
