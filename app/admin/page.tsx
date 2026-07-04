import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct, logout } from "@/app/admin/actions";
import { deleteAnnouncement } from "@/app/admin/annonces/actions";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { ProfileForm } from "@/components/ProfileForm";
import type { Product, Announcement } from "@/lib/supabase/types";

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
  const [{ data: products }, { data: announcements }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("artisan_id", artisan.id)
      .order("created_at", { ascending: false })
      .returns<Product[]>(),
    supabase
      .from("announcements")
      .select("*")
      .eq("artisan_id", artisan.id)
      .order("created_at", { ascending: false })
      .returns<Announcement[]>(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-2xl font-semibold text-ink">
          Bonjour, {artisan.name}
        </h1>
        <form action={logout} className="shrink-0">
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
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/admin/nouveau-artisan"
            className="flex items-center justify-between gap-3 rounded-2xl border border-vichy/30 bg-vichy/10 px-4 py-3 text-sm font-medium text-vichy"
          >
            <span className="min-w-0">+ Ajouter un artisan (superadmin)</span>
            <span aria-hidden className="shrink-0">→</span>
          </Link>
          <Link
            href="/admin/artisans"
            className="flex items-center justify-between gap-3 rounded-2xl border border-vichy/30 bg-vichy/10 px-4 py-3 text-sm font-medium text-vichy"
          >
            <span className="min-w-0">Gérer les fiches artisans (superadmin)</span>
            <span aria-hidden className="shrink-0">→</span>
          </Link>
          <Link
            href="/admin/annonces-boutique"
            className="flex items-center justify-between gap-3 rounded-2xl border border-vichy/30 bg-vichy/10 px-4 py-3 text-sm font-medium text-vichy"
          >
            <span className="min-w-0">Annonces de la boutique (superadmin)</span>
            <span aria-hidden className="shrink-0">→</span>
          </Link>
          <Link
            href="/admin/produits-boutique"
            className="flex items-center justify-between gap-3 rounded-2xl border border-vichy/30 bg-vichy/10 px-4 py-3 text-sm font-medium text-vichy"
          >
            <span className="min-w-0">Tous les produits (superadmin)</span>
            <span aria-hidden className="shrink-0">→</span>
          </Link>
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-ink/10 bg-cream-light p-6">
        <h2 className="text-lg font-semibold text-ink">Ma fiche artisan</h2>
        <ProfileForm artisan={artisan} />
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="min-w-0 truncate text-lg font-semibold text-ink">Mes produits</h2>
          <Link
            href="/admin/produits/nouveau"
            className="shrink-0 rounded-full bg-vichy px-4 py-2 text-sm font-medium text-white transition hover:bg-vichy-light"
          >
            + Ajouter un produit
          </Link>
        </div>

        {products && products.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-3">
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
                  {product.price != null && (
                    <p className="text-sm text-ink-light">
                      {product.price.toFixed(2)} €
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm">
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

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="min-w-0 truncate text-lg font-semibold text-ink">Mes annonces</h2>
          <Link
            href="/admin/annonces/nouvelle"
            className="shrink-0 rounded-full bg-vichy px-4 py-2 text-sm font-medium text-white transition hover:bg-vichy-light"
          >
            + Ajouter une annonce
          </Link>
        </div>

        {announcements && announcements.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-3">
            {announcements.map((announcement) => (
              <li
                key={announcement.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-cream-light px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{announcement.title}</p>
                  {announcement.expires_at && (
                    <p className="text-sm text-ink-light">
                      Jusqu&apos;au{" "}
                      {new Date(announcement.expires_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm">
                  <Link
                    href={`/admin/annonces/${announcement.id}`}
                    className="text-vichy hover:underline"
                  >
                    Modifier
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteAnnouncement(announcement.id);
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
            Vous n&apos;avez pas encore publié d&apos;annonce.
          </p>
        )}
      </section>
    </div>
  );
}
