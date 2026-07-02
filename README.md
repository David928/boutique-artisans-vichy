# La Boutique des Artisans — Vichy

Web app présentant les artisans de la boutique collective de Vichy : leur
métier, leur histoire, leurs fiches produits, et un produit mis en avant
automatiquement chaque jour sur la page d'accueil.

Stack : Next.js (App Router) + Supabase (base de données, authentification,
stockage des photos).

## 1. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com/dashboard), créez un **nouveau
   projet** (différent de celui de votre autre app).
2. Une fois le projet créé, allez dans **Project Settings → API** : notez
   l'**URL du projet** et la clé **anon public**.

## 2. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplissez `.env.local` avec l'URL et la clé récupérées à l'étape 1 :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

## 3. Créer les tables et données de départ

Dans le dashboard Supabase → **SQL Editor → New query** :

1. Collez et exécutez tout le contenu de `supabase/schema.sql` (tables,
   sécurité, stockage des images).
2. Collez et exécutez tout le contenu de `supabase/seed.sql` (ajoute
   GravEtincelle comme premier artisan avec un produit d'exemple).

## 4. Créer un compte de connexion pour un artisan

1. Dashboard Supabase → **Authentication → Users → Add user**. Créez un
   utilisateur avec un email et un mot de passe (à communiquer à l'artisan).
2. Récupérez l'**UUID** de cet utilisateur (colonne `UID` dans la liste).
3. Dans **SQL Editor**, reliez ce compte à la fiche artisan
   (exemple pour GravEtincelle) :

   ```sql
   insert into public.profiles (id, artisan_id)
   select '<uuid-copié-à-l-étape-2>', a.id
   from public.artisans a
   where a.slug = 'gravetincelle';
   ```

Répétez les étapes 1 à 3 pour chaque nouvel artisan (créez d'abord sa ligne
dans `artisans` via SQL Editor ou depuis un futur outil d'admin, puis son
compte, puis le lien dans `profiles`).

## 5. Lancer le site en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

- `/` — accueil avec le produit du jour
- `/artisans` — liste des artisans
- `/admin/login` — connexion artisan (avec le compte créé à l'étape 4)

## 6. Déployer sur Vercel

1. Poussez le projet sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com), importez le dépôt.
3. Dans les réglages du projet Vercel → **Environment Variables**, ajoutez
   `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (mêmes
   valeurs que `.env.local`).
4. Déployez.

## Notes

- Le **produit du jour** change automatiquement chaque jour (aucune action
  manuelle) : voir `lib/featured-product.ts`.
- Chaque artisan gère sa propre fiche et ses propres produits depuis
  `/admin` une fois connecté ; il ne peut pas modifier les fiches des autres
  artisans (protégé par les règles de sécurité Supabase — RLS).
- Les couleurs du site (`app/globals.css`) sont basées sur le logo fourni ;
  modifiables facilement si un vrai logo/charte graphique de la boutique
  collective est établi plus tard.
