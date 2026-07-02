-- La Boutique des Artisans Vichy — schéma de base
-- À exécuter une fois dans l'éditeur SQL du projet Supabase (SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.artisans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  story text,
  photo_url text,
  email text,
  phone text,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10, 2),
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_artisan_id_idx on public.products (artisan_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.artisans enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;

-- artisans : lecture publique, écriture réservée au propriétaire (via profiles)
create policy "artisans_public_read" on public.artisans
  for select using (true);

create policy "artisans_owner_update" on public.artisans
  for update using (
    id in (select artisan_id from public.profiles where id = auth.uid())
  );

-- profiles : chaque artisan ne voit/gère que sa propre ligne
create policy "profiles_owner_read" on public.profiles
  for select using (id = auth.uid());

-- products : lecture publique, écriture réservée au propriétaire de l'artisan lié
create policy "products_public_read" on public.products
  for select using (true);

create policy "products_owner_insert" on public.products
  for insert with check (
    artisan_id in (select artisan_id from public.profiles where id = auth.uid())
  );

create policy "products_owner_update" on public.products
  for update using (
    artisan_id in (select artisan_id from public.profiles where id = auth.uid())
  );

create policy "products_owner_delete" on public.products
  for delete using (
    artisan_id in (select artisan_id from public.profiles where id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Storage : bucket public "images", un sous-dossier par slug d'artisan
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

-- Un artisan connecté ne peut écrire que dans le dossier "<slug-de-son-artisan>/..."
create policy "images_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] in (
      select a.slug from public.artisans a
      join public.profiles p on p.artisan_id = a.id
      where p.id = auth.uid()
    )
  );

create policy "images_owner_update" on storage.objects
  for update using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] in (
      select a.slug from public.artisans a
      join public.profiles p on p.artisan_id = a.id
      where p.id = auth.uid()
    )
  );

create policy "images_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] in (
      select a.slug from public.artisans a
      join public.profiles p on p.artisan_id = a.id
      where p.id = auth.uid()
    )
  );
