"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Accueil",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9"
        />
      </svg>
    ),
  },
  {
    href: "/artisans",
    label: "Artisans",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6M14 20c0-2.6 1.7-4.8 4-5.6c1.8.6 3 2.3 3 4.3v1.3"
        />
      </svg>
    ),
  },
  {
    href: "/nouveautes",
    label: "Nouveautés",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10v4a1 1 0 0 0 1 1h2l4.5 3.5a.8.8 0 0 0 1.3-.6V6.1a.8.8 0 0 0-1.3-.6L6 9H4a1 1 0 0 0-1 1Z"
        />
        <path
          strokeLinecap="round"
          d="M16.5 9c.8.7 1.3 1.7 1.3 3s-.5 2.3-1.3 3M19 6.5C20.3 7.7 21 9.3 21 12s-.7 4.3-2 5.5"
        />
      </svg>
    ),
  },
  {
    href: "/favoris",
    label: "Favoris",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.5s-7.5-4.6-9.8-9.2C.7 8 2 4.8 5.2 4.1c2-.4 3.9.5 4.8 2.3.4.8 1.6.8 2 0 .9-1.8 2.8-2.7 4.8-2.3 3.2.7 4.5 3.9 3 7.2-2.3 4.6-9.8 9.2-9.8 9.2Z"
        />
      </svg>
    ),
  },
  {
    href: "/admin",
    label: "Espace pro",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 20c0-4.1 3.4-6.5 7.5-6.5s7.5 2.4 7.5 6.5"
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-cream-light/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                active ? "text-vichy" : "text-ink-light"
              }`}
            >
              {tab.icon(active)}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
