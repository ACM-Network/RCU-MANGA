"use client";

import { memo } from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ReaderPanelProps {
  src: string;
  alt: string;
  priority?: boolean;
  index: number;
}

function ReaderPanelComponent({ src, alt, priority = false, index }: ReaderPanelProps) {
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
        "overflow-hidden rounded-[26px] border border-white/8 bg-black/40 shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-all duration-500 sm:rounded-[32px]",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      <div className="relative bg-black/30">
        {!loaded ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-white/5 via-white/[0.03] to-transparent" />
        ) : null}
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={2400}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 920px"
          className={cn(
            "h-auto w-full object-cover transition duration-500",
            loaded ? "scale-100 opacity-100" : "scale-[1.015] opacity-0",
          )}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </figure>
  );
}

export const ReaderPanel = memo(ReaderPanelComponent);
