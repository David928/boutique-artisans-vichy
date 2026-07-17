import { createClient } from "@/lib/supabase/server";
import { ProductBrowser } from "@/components/ProductBrowser";
import type { ProductWithArtisan } from "@/lib/supabase/types";

export const metadata = {
  title: "Tous les produits — La Boutique des Artisans Vichy",
};

export default async function ProduitsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, artisan:artisans(slug, name)")
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .returns<ProductWithArtisan[]>();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Tous les produits</h1>
      <p className="mt-1 text-sm text-ink-light">
        Toutes les créations disponibles, tous artisans confondus.
      </p>

      <div className="mt-5">
        <ProductBrowser products={products ?? []} />
      </div>
    </div>
  );
}
