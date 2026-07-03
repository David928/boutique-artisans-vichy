import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct, logout } from "@/app/admin/actions";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { ProfileForm } from "@/components/ProfileForm";
import type { Product } from "@/lib/supabase/types";

export const metadata = {
  title: "Tableau de bord — La Boutique des Artisans Vichy",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ pwError?: string; pwSuccess?: string }>;
}) {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  const { pwError, pwSuccess } = await searchParams;
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

      {pwError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {pwError}
        </p>
      )}
      {pwSuccess && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          Mot de passe mis à jour.
        </p>
      )}

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
        <ProfileForm artisan={artisan} />
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
