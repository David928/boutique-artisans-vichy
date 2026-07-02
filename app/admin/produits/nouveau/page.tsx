import { redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createProduct } from "@/app/admin/actions";

export const metadata = {
  title: "Nouveau produit — La Boutique des Artisans Vichy",
};

export default async function NewProductPage() {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">Nouveau produit</h1>

      <form action={createProduct} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          Nom du produit
          <input
            type="text"
            name="name"
            required
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Description
          <textarea
            name="description"
            rows={5}
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
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Photo
          <input
            type="file"
            name="image"
            accept="image/*"
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="is_available" defaultChecked />
          Disponible à la vente
        </label>
        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light"
        >
          Créer le produit
        </button>
      </form>
    </div>
  );
}
