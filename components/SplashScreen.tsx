"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [stage, setStage] = useState<"visible" | "fading" | "hidden">(
    "visible"
  );

  useEffect(() => {
    const fadeTimer = setTimeout(() => setStage("fading"), 700);
    const hideTimer = setTimeout(() => setStage("hidden"), 1000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (stage === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-cream transition-opacity duration-300 ${
        stage === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src="/logo.png"
        alt="La Boutique des Artisans Vichy"
        width={280}
        height={128}
        className="h-auto w-52 animate-[splash-in_0.4s_ease-out]"
        priority
      />
    </div>
  );
}
