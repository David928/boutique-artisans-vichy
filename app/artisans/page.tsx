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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold text-ink">Nos artisans</h1>
      <p className="mt-2 text-ink-light">
        Chaque artisan de la boutique a son propre métier, son histoire et
        ses créations.
      </p>
      {artisans && artisans.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {artisans.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-ink-light">
          Les fiches artisans arrivent bientôt.
        </p>
      )}
    </div>
  );
}
