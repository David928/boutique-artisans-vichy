import { createClient } from "@/lib/supabase/server";
import type { ProductWithArtisan } from "@/lib/supabase/types";

/**
 * Choisit un produit mis en avant au hasard parmi les produits disponibles.
 * Appelé à chaque visite de l'accueil (page rendue dynamiquement, voir
 * `export const dynamic = "force-dynamic"` dans app/page.tsx) : chaque
 * personne qui ouvre l'application peut donc voir un produit différent.
 */
export async function getFeaturedProduct(
  excludeId?: string
): Promise<ProductWithArtisan | null> {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, artisan:artisans(slug, name)")
    .eq("is_available", true);

  if (!products || products.length === 0) return null;

  const pool = products.filter((p) => p.id !== excludeId);
  const candidates = pool.length > 0 ? pool : products;

  const index = Math.floor(Math.random() * candidates.length);

  return candidates[index] as ProductWithArtisan;
}
