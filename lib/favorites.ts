const KEY = "boutique-favoris";
const EVENT = "favoris-changed";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

export function getFavorites(): string[] {
  return read();
}

export function isFavorite(productId: string): boolean {
  return read().includes(productId);
}

export function toggleFavorite(productId: string): string[] {
  const current = read();
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];
  write(next);
  return next;
}

export function subscribeFavorites(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
