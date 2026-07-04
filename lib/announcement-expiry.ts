export const MAX_ANNOUNCEMENT_DAYS = 15;

function maxExpiryDate(): Date {
  return new Date(Date.now() + MAX_ANNOUNCEMENT_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Calcule la date d'expiration d'une annonce : si l'artisan n'en choisit pas,
 * ou en choisit une trop lointaine, elle est plafonnée à MAX_ANNOUNCEMENT_DAYS
 * pour que les annonces ne s'accumulent pas indéfiniment.
 */
export function computeExpiresAt(value: FormDataEntryValue | null): string {
  const max = maxExpiryDate();
  const str = String(value ?? "").trim();
  if (!str) return max.toISOString();

  const requested = new Date(str);
  if (isNaN(requested.getTime())) return max.toISOString();

  return requested.getTime() < max.getTime()
    ? requested.toISOString()
    : max.toISOString();
}

/** Date max sélectionnable dans le champ (format YYYY-MM-DD pour <input type="date">). */
export function maxExpiryDateInputValue(): string {
  return maxExpiryDate().toISOString().slice(0, 10);
}
