import { notFound, redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/ProductForm";
import type { Product } from "@/lib/supabase/types";

export const metadata = {
  title: "Modifier le produit — La Boutique des Artisans Vichy",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("artisan_id", artisan.id)
    .maybeSingle<Product>();

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">
        Modifier « {product.name} »
      </h1>
      <ProductForm artisanSlug={artisan.slug} product={product} />
    </div>
  );
}
