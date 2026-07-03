"use client";

import { useSyncExternalStore } from "react";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/favorites";

const getServerSnapshot = () => false;

export function FavoriteButton({ productId }: { productId: string }) {
  const active = useSyncExternalStore(
    subscribeFavorites,
    () => isFavorite(productId),
    getServerSnapshot
  );

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:scale-110"
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "#c0392b" : "none"}
        stroke={active ? "#c0392b" : "currentColor"}
        strokeWidth={1.8}
        className="h-3.5 w-3.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.5s-7.5-4.6-9.8-9.2C.7 8 2 4.8 5.2 4.1c2-.4 3.9.5 4.8 2.3.4.8 1.6.8 2 0 .9-1.8 2.8-2.7 4.8-2.3 3.2.7 4.5 3.9 3 7.2-2.3 4.6-9.8 9.2-9.8 9.2Z"
        />
      </svg>
    </button>
  );
}
