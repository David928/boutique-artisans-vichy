import { notFound, redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "@/app/admin/actions";
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

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">
        Modifier « {product.name} »
      </h1>

      <form action={updateProductWithId} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          Nom du produit
          <input
            type="text"
            name="name"
            required
            defaultValue={product.name}
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Description
          <textarea
            name="description"
            rows={5}
            defaultValue={product.description ?? ""}
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Prix (€)
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            defaultValue={product.price ?? ""}
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Nouvelle photo (laisser vide pour garder l&apos;actuelle)
          <input
            type="file"
            name="image"
            accept="image/*"
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="is_available"
            defaultChecked={product.is_available}
          />
          Disponible à la vente
        </label>
        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
