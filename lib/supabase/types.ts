export type Artisan = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  story: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  artisan_id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
};

export type ProductWithArtisan = Product & {
  artisan: Pick<Artisan, "slug" | "name">;
};
