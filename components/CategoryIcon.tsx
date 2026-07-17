const PATHS: Record<string, React.ReactNode> = {
  Bougie: (
    <>
      <rect x="9" y="8" width="6" height="12" rx="1.2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c1.2-1.3 1.8-2.3 1.8-3.4S12 2 12 2s-1.8 1.5-1.8 2.6S10.8 6.7 12 8Z"
      />
    </>
  ),
  Sublimation: (
    <>
      <rect x="10" y="3" width="4" height="10" rx="2" />
      <circle cx="12" cy="17" r="3.5" />
    </>
  ),
  Couture: (
    <>
      <path strokeLinecap="round" d="M5 19 17 7" />
      <circle cx="18.3" cy="5.7" r="1.7" />
      <path strokeLinecap="round" d="M9.5 14.5c-1.5 2-3.5 2-5-.5" />
    </>
  ),
  Personnalisation: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20l1-4L15.5 5.5l3 3L8 20l-4 1Z"
      />
      <path strokeLinecap="round" d="M13.5 7.5l3 3" />
    </>
  ),
  Bois: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3 7.5 10h3l-4 6h4v4h3v-4h4l-4-6h3Z"
    />
  ),
  Bijoux: (
    <>
      <path strokeLinejoin="round" d="M4 9 8.5 3h7L20 9l-8 12L4 9Z" />
      <path d="M4 9h16" />
    </>
  ),
  Céramique: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 3h6l-.8 3.4c2.1 1.5 3.3 3.9 3.3 6.6a5.5 5.5 0 0 1-11 0c0-2.7 1.2-5.1 3.3-6.6L9 3Z"
    />
  ),
  Papeterie: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1.5" />
      <path strokeLinecap="round" d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  "Gravure laser": (
    <path
      strokeLinejoin="round"
      d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
    />
  ),
  "Impression 3D": (
    <>
      <path strokeLinejoin="round" d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="M12 12v9M12 12 20 7.5M12 12 4 7.5" />
    </>
  ),
  Crochet: (
    <>
      <circle cx="8" cy="16" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 13c3-1 5-3 5-6 0-2-1.5-3-3-3s-2.5 1.2-2.5 2.5c0 1 .7 1.5 1.5 1.5"
      />
    </>
  ),
  Enfants: (
    <>
      <rect x="9" y="9" width="6" height="11" rx="2" />
      <path strokeLinecap="round" d="M10.5 9V6a1.5 1.5 0 0 1 3 0v3" />
      <path strokeLinecap="round" d="M9 13h6M9 16h6" />
    </>
  ),
  Résine: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c3 4.5 5 7.6 5 10.2a5 5 0 0 1-10 0C7 10.6 9 7.5 12 3Z"
    />
  ),
  Beauté: (
    <path
      strokeLinejoin="round"
      d="M12 3c.6 3.2 1.8 4.4 5 5-3.2.6-4.4 1.8-5 5-.6-3.2-1.8-4.4-5-5 3.2-.6 4.4-1.8 5-5Z"
    />
  ),
  Alimentaire: (
    <>
      <path strokeLinecap="round" d="M8 3v6a2 2 0 0 0 4 0V3M10 9v12" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 3c-1.4 0-2.5 1.8-2.5 4s1.1 4 2.5 4v10"
      />
    </>
  ),
};

const FALLBACK = (
  <>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m20.5 12.7-7.8 7.8a1.5 1.5 0 0 1-2.1 0l-6.6-6.6a1.5 1.5 0 0 1-.4-1.1V5.5A1.5 1.5 0 0 1 5.1 4h7.3c.4 0 .8.16 1.1.44l6.9 6.9a1.5 1.5 0 0 1 .1 1.36Z"
    />
    <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
  </>
);

export function CategoryIcon({ category }: { category: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
    >
      {PATHS[category] ?? FALLBACK}
    </svg>
  );
}
