"use client";

import { useTransition } from "react";
import { deleteArtisanAsAdmin } from "@/app/admin/artisans/actions";

export function DeleteArtisanButton({
  artisanId,
  artisanName,
}: {
  artisanId: string;
  artisanName: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      `Supprimer définitivement « ${artisanName} » ? Sa fiche, ses produits et ses annonces seront tous supprimés, et son compte de connexion désactivé. Cette action est irréversible.`
    );
    if (!confirmed) return;

    startTransition(() => {
      deleteArtisanAsAdmin(artisanId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm text-red-700 hover:underline disabled:opacity-50"
    >
      {pending ? "Suppression..." : "Supprimer cet artisan"}
    </button>
  );
}
