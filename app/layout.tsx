import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/SplashScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "La Boutique des Artisans — Vichy";
const description =
  "Découvrez les artisans de la Boutique des Artisans à Vichy, leur savoir-faire, leur histoire et leurs créations.";

export const metadata: Metadata = {
  metadataBase: new URL("https://boutique-artisans-vichy.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "La Boutique des Artisans — Vichy",
    locale: "fr_FR",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Boutique des Artisans",
  },
};

export const viewport: Viewport = {
  themeColor: "#f0e9d8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <SplashScreen />
        <Header />
        <main className="flex-1 pb-20">{children}</main>
        <BottomNav />
        <Analytics />
      </body>
    </html>
  );
}
