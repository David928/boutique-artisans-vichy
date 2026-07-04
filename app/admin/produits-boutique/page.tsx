import { redirect } from "next/navigation";
import Link from "next/link";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { createClient } from "@/lib/supabase/server";
import {
  deleteProductAsAdmin,
  toggleProductAvailabilityAsAdmin,
} from "@/app/admin/produits-boutique/actions";
import type { ProductWithArtisan } from "@/lib/supabase/types";

export const metadata = {
  title: "Tous les produits — La Boutique des Artisans Vichy",
};

export default async function AdminAllProductsPage() {
  if (!(await isSuperAdmin())) redirect("/admin");

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, artisan:artisans(slug, name)")
    .order("created_at", { ascending: false })
    .returns<ProductWithArtisan[]>();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">Tous les produits</h1>
      <p className="mt-1 text-sm text-ink-light">
        Vue d&apos;ensemble des produits de tous les artisans, tous
        confondus.
      </p>

      {products && products.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-cream-light px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">
                  {product.name}
                  {!product.is_available && (
                    <span className="ml-2 text-xs text-ink-light">
                      (indisponible)
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-ink-light">
                  {product.artisan.name}
                  {product.price != null && <> · {product.price.toFixed(2)} €</>}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                <Link
                  href={`/produits/${product.slug}`}
                  className="text-vichy hover:underline"
                >
                  Voir
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await toggleProductAvailabilityAsAdmin(
                      product.id,
                      !product.is_available
                    );
                  }}
                >
                  <button type="submit" className="text-vichy hover:underline">
                    {product.is_available ? "Masquer" : "Republier"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteProductAsAdmin(product.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-700 hover:underline"
                  >
                    Supprimer
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-ink-light">Aucun produit pour l&apos;instant.</p>
      )}
    </div>
  );
}
