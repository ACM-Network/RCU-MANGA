"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ReaderPanelProps {
  src: string;
  alt: string;
  priority?: boolean;
  index: number;
}

export function ReaderPanel({ src, alt, priority = false, index }: ReaderPanelProps) {
  const [visible, setVisible] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const figureRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = figureRef.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <figure
      ref={figureRef}
      data-panel-index={index}
      className={cn(
        "overflow-hidden rounded-[32px] border border-white/8 bg-black/40 transition-all duration-700",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      <div className="relative">
        {!loaded ? <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-white/5 to-transparent" /> : null}
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={2400}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 920px"
          className={cn(
            "h-auto w-full object-cover transition duration-700",
            loaded ? "scale-100 opacity-100" : "scale-[1.015] opacity-0",
          )}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </figure>
  );
}
