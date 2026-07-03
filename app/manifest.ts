import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Boutique des Artisans — Vichy",
    short_name: "Boutique des Artisans",
    description:
      "Découvrez les artisans de la Boutique des Artisans à Vichy, leur savoir-faire et leurs créations.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f2e7",
    theme_color: "#f0e9d8",
    lang: "fr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
