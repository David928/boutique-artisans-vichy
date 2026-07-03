import { redirect } from "next/navigation";
import { getCurrentArtisan } from "@/lib/current-artisan";
import { ProductForm } from "@/components/ProductForm";

export const metadata = {
  title: "Nouveau produit — La Boutique des Artisans Vichy",
};

export default async function NewProductPage() {
  const artisan = await getCurrentArtisan();
  if (!artisan) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-ink">Nouveau produit</h1>
      <ProductForm artisanSlug={artisan.slug} />
    </div>
  );
}
