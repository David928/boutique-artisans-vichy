"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createAnnouncement, updateAnnouncement } from "@/app/admin/annonces/actions";
import { uploadImageClient } from "@/lib/supabase/upload";
import type { Announcement } from "@/lib/supabase/types";

export function AnnouncementForm({
  artisanSlug,
  announcement,
  redirectTo = "/admin",
}: {
  artisanSlug: string;
  announcement?: Announcement;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
          const url = await uploadImageClient(artisanSlug, imageFile);
          formData.set("image_url", url);
        }

        if (announcement) {
          await updateAnnouncement(announcement.id, formData);
        } else {
          await createAnnouncement(formData);
        }
        router.push(redirectTo);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    });
  }

  const expiresDefault = announcement?.expires_at
    ? announcement.expires_at.slice(0, 10)
    : "";

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
          defaultValue={announcement?.title}
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        Description
        <textarea
          name="description"
          rows={4}
          defaultValue={announcement?.description ?? ""}
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {announcement
          ? "Nouvelle photo (laisser vide pour garder l'actuelle)"
          : "Photo (optionnelle)"}
        <input
          type="file"
          name="image"
          accept="image/*"
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        Date de fin (optionnelle)
        <input
          type="date"
          name="expires_at"
          defaultValue={expiresDefault}
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
        />
        <span className="text-xs text-ink-light">
          Passé cette date, l&apos;annonce disparaît automatiquement de
          l&apos;application.
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light disabled:opacity-50"
      >
        {pending
          ? "Enregistrement..."
          : announcement
            ? "Enregistrer"
            : "Publier l'annonce"}
      </button>
    </form>
  );
}
