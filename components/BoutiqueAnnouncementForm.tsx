"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createBoutiqueAnnouncement } from "@/app/admin/annonces-boutique/actions";
import { uploadImageClient } from "@/lib/supabase/upload";

export function BoutiqueAnnouncementForm({
  uploadFolderSlug,
}: {
  uploadFolderSlug: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get("image") as File | null;
    formData.delete("image");

    startTransition(async () => {
      try {
        if (imageFile && imageFile.size > 0) {
          const url = await uploadImageClient(uploadFolderSlug, imageFile);
          formData.set("image_url", url);
        }
        await createBoutiqueAnnouncement(formData);
        router.refresh();
        setKey((k) => k + 1); // reset le formulaire
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    });
  }

  return (
    <form
      key={key}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-cream-light p-6"
    >
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm text-ink">
        Titre
        <input
          type="text"
          name="title"
          required
          className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        Description
        <textarea
          name="description"
          rows={4}
          className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        Photo (optionnelle)
        <input
          type="file"
          name="image"
          accept="image/*"
          className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        Date de fin (optionnelle)
        <input
          type="date"
          name="expires_at"
          className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light disabled:opacity-50"
      >
        {pending ? "Publication..." : "Publier l'annonce"}
      </button>
    </form>
  );
}
