import { login } from "@/app/admin/actions";

export const metadata = {
  title: "Connexion artisan — La Boutique des Artisans Vichy",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-ink">Espace artisan</h1>
      <p className="mt-1 text-sm text-ink-light">
        Connectez-vous avec les identifiants qui vous ont été communiqués.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={login} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Mot de passe
          <input
            type="password"
            name="password"
            required
            className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
