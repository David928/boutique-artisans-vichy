-- Données de démarrage : GravEtincelle comme premier artisan.
-- À exécuter après schema.sql, dans l'éditeur SQL Supabase.
-- L'histoire ci-dessous est un premier jet — à modifier par David depuis
-- l'espace admin une fois son compte créé (voir README.md).

insert into public.artisans (slug, name, tagline, story, email, phone, website)
values (
  'gravetincelle',
  'GravEtincelle',
  'Gravure laser · Impression 3D · Sublimation',
  'GravEtincelle, c''est l''atelier de David : gravure laser, impression 3D et sublimation pour créer des objets personnalisés, fabriqués à la main et sur commande. Chaque pièce est pensée pour raconter une histoire — la vôtre, celle d''un proche, ou celle d''un cadeau qui sort de l''ordinaire.',
  'contact@gravetincelle.com',
  '06 66 09 37 65',
  'https://gravetincelle.com'
)
on conflict (slug) do nothing;

insert into public.products (artisan_id, slug, name, description, price, is_available)
select
  a.id,
  'mug-animal-totem-personnalise',
  'Mug Animal Totem personnalisé',
  'Un mug en céramique blanche (33 cl) sublimé avec l''animal totem de votre choix. Indiquez votre animal et vos remarques de personnalisation, et il est réalisé sur commande, avec soin, dans l''atelier.',
  17.00,
  true
from public.artisans a
where a.slug = 'gravetincelle'
on conflict (slug) do nothing;

-- Pour relier un compte de connexion (créé dans Authentication > Add user)
-- à cette fiche artisan, récupérez l'UUID de l'utilisateur puis exécutez :
--
-- insert into public.profiles (id, artisan_id)
-- select '<uuid-de-l-utilisateur-auth>', a.id
-- from public.artisans a
-- where a.slug = 'gravetincelle';
