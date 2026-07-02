import { createClient } from "@/lib/supabase/server";
import { ArtisanCard } from "@/components/ArtisanCard";
import type { Artisan } from "@/lib/supabase/types";

export const revalidate = 3600;

export const metadata = {
  title: "Nos artisans — La Boutique des Artisans Vichy",
};

export default async function ArtisansPage() {
  const supabase = await createClient();
  const { data: artisans } = await supabase
    .from("artisans")
    .select("*")
    .order("name", { ascending: true })
    .returns<Artisan[]>();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-ink">Nos artisans</h1>
      <p className="mt-1 text-sm text-ink-light">
        Chaque artisan de la boutique a son propre métier, son histoire et
        ses créations.
      </p>
      {artisans && artisans.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {artisans.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-ink-light">
          Les fiches artisans arrivent bientôt.
        </p>
      )}
    </div>
  );
}
