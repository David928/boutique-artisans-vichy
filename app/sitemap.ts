import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://boutique-artisans-vichy.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const [{ data: artisans }, { data: products }] = await Promise.all([
    supabase.from("artisans").select("slug, created_at"),
    supabase.from("products").select("slug, created_at"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/artisans`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/nouveautes`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/infos`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const artisanRoutes: MetadataRoute.Sitemap = (artisans ?? []).map((a) => ({
    url: `${BASE_URL}/artisans/${a.slug}`,
    lastModified: a.created_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/produits/${p.slug}`,
    lastModified: p.created_at,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...artisanRoutes, ...productRoutes];
}
