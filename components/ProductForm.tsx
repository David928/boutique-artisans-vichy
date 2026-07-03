"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createProduct, updateProduct } from "@/app/admin/actions";
import { uploadImageClient } from "@/lib/supabase/upload";
import type { Product } from "@/lib/supabase/types";

export function ProductForm({
  artisanSlug,
  product,
}: {
  artisanSlug: string;
  product?: Product;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const files = (formData.getAll("images") as File[]).filter(
      (f) => f && f.size > 0
    );
    formData.delete("images");

    startTransition(async () => {
      try {
        for (const file of files) {
          const url = await uploadImageClient(artisanSlug, file);
          formData.append("image_urls", url);
        }

        if (product) {
          await updateProduct(product.id, formData);
        } else {
          await createProduct(formData);
        }
        router.push("/admin");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm text-ink">
        Nom du produit
        <input
          type="text"
          name="name"
          required
          defaultValue={product?.name}
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        Description
        <textarea
          name="description"
          rows={5}
          defaultValue={product?.description ?? ""}
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
          defaultValue={product?.price ?? ""}
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {product
          ? `Nouvelles photos (laisser vide pour garder les actuelles — ${
              product.images?.length ?? 0
            } photo${(product.images?.length ?? 0) > 1 ? "s" : ""} en ligne)`
          : "Photos (la première sera utilisée comme photo principale)"}
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none"
        />
        {product && (
          <span className="text-xs text-ink-light">
            Sélectionner plusieurs fichiers remplace toutes les photos
            actuelles, la première devient la photo principale.
          </span>
        )}
      </label>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="is_available"
          defaultChecked={product?.is_available ?? true}
        />
        Disponible à la vente
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light disabled:opacity-50"
      >
        {pending
          ? "Enregistrement..."
          : product
            ? "Enregistrer"
            : "Créer le produit"}
      </button>
    </form>
  );
}
