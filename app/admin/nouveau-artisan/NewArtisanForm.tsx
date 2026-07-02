"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ARTISAN_CATEGORIES } from "@/lib/categories";
import { slugify } from "@/lib/slugify";
import {
  createArtisanWithAccount,
  type CreateArtisanState,
} from "@/app/admin/nouveau-artisan/actions";

const initialState: CreateArtisanState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit rounded-full bg-ink px-5 py-2 text-sm font-medium text-cream-light transition hover:bg-ink-light disabled:opacity-50"
    >
      {pending ? "Création..." : "Créer l'artisan"}
    </button>
  );
}

export function NewArtisanForm() {
  const [state, formAction] = useActionState(
    createArtisanWithAccount,
    initialState
  );
  const [name, setName] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slug, setSlug] = useState("");

  if (state.success) {
    return (
      <div className="rounded-2xl border border-vichy/30 bg-vichy/10 p-6">
        <h2 className="text-lg font-semibold text-ink">
          {state.success.name} a été créé !
        </h2>
        <p className="mt-1 text-sm text-ink-light">
          Communiquez ces identifiants à l&apos;artisan pour qu&apos;il se
          connecte sur <span className="font-medium">/admin</span>. Le mot de
          passe ne sera plus jamais affiché.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-ink">Email</dt>
            <dd className="font-mono text-ink">{state.success.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-ink">
              Mot de passe
            </dt>
            <dd className="font-mono text-ink">{state.success.password}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-ink">Fiche</dt>
            <dd className="text-vichy">/artisans/{state.success.slug}</dd>
          </div>
        </dl>
        <a
          href="/admin/nouveau-artisan"
          className="mt-5 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition hover:bg-white/50"
        >
          Ajouter un autre artisan
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm text-ink">
        Nom de l&apos;artisan
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        Identifiant (slug, utilisé dans l&apos;URL)
        <input
          type="text"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value);
          }}
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 font-mono text-sm text-ink outline-none focus:border-vichy"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        Email de connexion
        <input
          type="email"
          name="email"
          required
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
        />
        <span className="text-xs text-ink-light">
          Un mot de passe sera généré automatiquement et affiché une seule
          fois après la création.
        </span>
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        Métier / accroche (optionnel)
        <input
          type="text"
          name="tagline"
          className="rounded-lg border border-ink/20 bg-cream-light px-3 py-2 text-ink outline-none focus:border-vichy"
        />
      </label>

      <div className="flex flex-col gap-1.5 text-sm text-ink">
        Catégories
        <div className="flex flex-wrap gap-2">
          {ARTISAN_CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-1.5 rounded-full border border-ink/20 bg-cream-light px-3 py-1.5 text-sm text-ink has-[:checked]:border-vichy has-[:checked]:bg-vichy/10 has-[:checked]:text-vichy"
            >
              <input
                type="checkbox"
                name="categories"
                value={category}
                className="accent-vichy"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
