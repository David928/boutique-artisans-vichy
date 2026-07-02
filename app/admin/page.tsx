import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createClient } from "@/lib/supabase/server";
import { updateArtisanProfile, deleteProduct, logout } from "@/app/admin/actions";
import { ARTISAN_CATEGORIES } from "@/lib/categories";
import { isSuperAdmin } from "@/lib/is-superadmin";
import type { Product } from "@/lib/supabase/types";

export const metadata = {
  title: "Tableau de bord — La Boutique des Artisans Vichy",
};

export default async function AdminDashboardPage() {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const superAdmin = await isSuperAdmin();

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("artisan_id", artisan.id)
    .order("created_at", { ascending: false })
    .returns<Product[]>();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">
          Bonjour, {artisan.name}
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-ink-light hover:text-vichy"
          >
            Se déconnecter
          </button>
        </form>
      </div>

      {superAdmin && (
        <Link
          href="/admin/nouveau-artisan"
          className="mt-4 flex items-center justify-between rounded-2xl border border-vichy/30 bg-vichy/10 px-4 py-3 text-sm font-medium text-vichy"
        >
          + Ajouter un artisan (superadmin)
          <span aria-hidden>→</span>
        </Link>
      )}

      <section className="mt-8 rounded-2xl border border-ink/10 bg-cream-light p-6">
        <h2 className="text-lg font-semibold text-ink">Ma fiche artisan</h2>
        <form
          action={updateArtisanProfile}
          className="mt-4 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1 text-sm text-ink">
            Métier / accroche
            <input
              type="text"
              name="tagline"
              defaultValue={artisan.tagline ?? ""}
              className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-vichy"
            />
          </label>
          <div className="flex flex-col gap-1.5 text-sm text-ink">
            Catégories (une ou plusieurs)
            <div className="flex flex-wrap gap-2">
              {ARTISAN_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-1.5 rounded-full border border-ink/20 bg-white px-3 py-1.5 text-sm text-ink has-[:checked]:border-vichy has-[:checked]:bg-vichy/10 has-[:checked]:text-vichy"
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={category}
                    defaultChecked={artisan.categories?.includes(category)}
                    className="accent-vichy"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Mon histoire
            <textarea
              name="story"
              rows={6}
              defaultValue={artisan.story ?? ""}
              className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-vichy"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Photo (portrait ou atelier)
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-ink">
              Email
              <input
                type="email"
                name="email"
                defaultValue={artisan.email ?? ""}
                className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-vichy"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              Téléphone
              <input
                type="text"
                name="phone"
                defaultValue={artisan.phone ?? ""}
                className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-vichy"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink">
              Site web
              <input
                type="text"
                name="website"
                defaultValue={artisan.website ?? ""}
                className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-vichy"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light"
          >
            Enregistrer ma fiche
          </button>
        </form>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Mes produits</h2>
          <Link
            href="/admin/produits/nouveau"
            className="rounded-full bg-vichy px-4 py-2 text-sm font-medium text-white transition hover:bg-vichy-light"
          >
            + Ajouter un produit
          </Link>
        </div>

        {products && products.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-3">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-ink/10 bg-cream-light px-4 py-3"
              >
                <div>
                  <p className="font-medium text-ink">
                    {product.name}
                    {!product.is_available && (
                      <span className="ml-2 text-xs text-ink-light">
                        (indisponible)
                      </span>
                    )}
                  </p>
                  {product.price != null && (
                    <p className="text-sm text-ink-light">
                      {product.price.toFixed(2)} €
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Link
                    href={`/admin/produits/${product.id}`}
                    className="text-vichy hover:underline"
                  >
                    Modifier
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteProduct(product.id);
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
          <p className="mt-5 text-ink-light">
            Vous n&apos;avez pas encore ajouté de produit.
          </p>
        )}
      </section>
    </div>
  );
}
