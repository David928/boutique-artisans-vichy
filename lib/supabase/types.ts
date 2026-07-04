export type Artisan = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  story: string | null;
  photo_url: string | null;
  categories: string[];
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
  images: string[];
  is_available: boolean;
  created_at: string;
};

export type ProductWithArtisan = Product & {
  artisan: Pick<Artisan, "slug" | "name">;
};

export type Announcement = {
  id: string;
  artisan_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  expires_at: string | null;
  created_at: string;
};

export type AnnouncementWithArtisan = Announcement & {
  artisan: Pick<Artisan, "slug" | "name"> | null;
};
