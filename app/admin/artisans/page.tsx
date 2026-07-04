import Link from "next/link";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/is-superadmin";
import { createClient } from "@/lib/supabase/server";
import type { Artisan } from "@/lib/supabase/types";

export const metadata = {
  title: "Gérer les artisans — La Boutique des Artisans Vichy",
};

export default async function AdminArtisansPage() {
  if (!(await isSuperAdmin())) redirect("/admin");

  const supabase = await createClient();
  const { data: artisans } = await supabase
    .from("artisans")
    .select("*")
    .order("name", { ascending: true })
    .returns<Artisan[]>();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-2xl font-semibold text-ink">Gérer les artisans</h1>
        <Link
          href="/admin/nouveau-artisan"
          className="shrink-0 rounded-full bg-vichy px-4 py-2 text-sm font-medium text-white transition hover:bg-vichy-light"
        >
          + Ajouter
        </Link>
      </div>

      {artisans && artisans.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {artisans.map((artisan) => (
            <li
              key={artisan.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-cream-light px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{artisan.name}</p>
                {artisan.tagline && (
                  <p className="truncate text-sm text-ink-light">{artisan.tagline}</p>
                )}
              </div>
              <Link
                href={`/admin/artisans/${artisan.id}`}
                className="shrink-0 text-sm text-vichy hover:underline"
              >
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-ink-light">Aucun artisan pour l&apos;instant.</p>
      )}
    </div>
  );
}
