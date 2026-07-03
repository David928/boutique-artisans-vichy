"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-ink/5 px-4 text-center text-ink-light">
        {name}
      </div>
    );
  }

  function scrollTo(index: number) {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: "smooth",
    });
    setActive(index);
  }

  function handleScroll() {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setActive(index);
  }

  return (
    <div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex aspect-square w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-2xl scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, index) => (
          <div
            key={src}
            className="relative aspect-square w-full shrink-0 snap-center bg-ink/5"
          >
            <Image
              src={src}
              alt={`${name} — photo ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Photo ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? "w-5 bg-vichy" : "w-1.5 bg-ink/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
