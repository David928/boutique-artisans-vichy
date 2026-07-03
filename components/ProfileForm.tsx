"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateArtisanProfile } from "@/app/admin/actions";
import { uploadImageClient } from "@/lib/supabase/upload";
import { ARTISAN_CATEGORIES } from "@/lib/categories";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import type { Artisan } from "@/lib/supabase/types";

export function ProfileForm({ artisan }: { artisan: Artisan }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const photoFile = formData.get("photo") as File | null;
    formData.delete("photo");

    startTransition(async () => {
      try {
        if (photoFile && photoFile.size > 0) {
          const url = await uploadImageClient(artisan.slug, photoFile);
          formData.set("photo_url", url);
        }
        await updateArtisanProfile(formData);
        setSaved(true);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          Fiche enregistrée.
        </p>
      )}

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
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light disabled:opacity-50"
        >
          {pending ? "Enregistrement..." : "Enregistrer ma fiche"}
        </button>
        <ChangePasswordModal />
      </div>
    </form>
  );
}
