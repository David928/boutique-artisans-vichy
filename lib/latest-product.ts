import { createClient } from "@/lib/supabase/server";
import type { ProductWithArtisan } from "@/lib/supabase/types";

/** Le dernier produit ajouté (par date de création), quel que soit l'artisan. */
export async function getLatestProduct(): Promise<ProductWithArtisan | null> {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, artisan:artisans(slug, name)")
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(1);

  return (products?.[0] as ProductWithArtisan) ?? null;
}
