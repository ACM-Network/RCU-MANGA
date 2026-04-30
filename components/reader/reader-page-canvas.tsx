"use client";

import { memo, useEffect, useRef, useState } from "react";

import { loadPageImage } from "@/lib/reader/page-assets";
import type { ChapterPageAsset } from "@/lib/types";

interface ReaderPageCanvasProps {
  page: ChapterPageAsset;
  pageIndex: number;
  title: string;
  viewerLabel: string;
  active: boolean;
}

function drawWatermark(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  viewerLabel: string,
  phase: number,
) {
  if (!viewerLabel) {
    return;
  }

  context.save();
  context.globalAlpha = 0.12;
  context.fillStyle = "#f5f1e8";
  context.font = `${Math.max(14, Math.round(width * 0.018))}px "Segoe UI", sans-serif`;
  context.textBaseline = "middle";

  const driftX = Math.sin(phase / 18) * 18;
  const driftY = Math.cos(phase / 18) * 12;

  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 2; column += 1) {
      const x = width * (0.22 + column * 0.38) + driftX;
      const y = height * (0.28 + row * 0.24) + driftY;

      context.save();
      context.translate(x, y);
      context.rotate((-18 * Math.PI) / 180);
      context.fillText(viewerLabel, 0, 0);
      context.restore();
    }
  }

  context.restore();
}

function drawPageIntoCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  viewerLabel: string,
  phase: number,
) {
  const bounds = canvas.getBoundingClientRect();
  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(bounds.width * devicePixelRatio));
  const height = Math.max(1, Math.floor(bounds.height * devicePixelRatio));

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#040309";
  context.fillRect(0, 0, width, height);

  const scale = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = (height - drawHeight) / 2;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  drawWatermark(context, width, height, viewerLabel, phase);
}

export const ReaderPageCanvas = memo(function ReaderPageCanvas({
  page,
  pageIndex,
  title,
  viewerLabel,
  active,
}: ReaderPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const phaseRef = useRef(pageIndex);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    imageRef.current = null;
    phaseRef.current = pageIndex;

    void loadPageImage(page)
      .then((image) => {
        if (cancelled) return;

        imageRef.current = image;
        setError(null);
        setReady(true);

        if (canvasRef.current) {
          drawPageIntoCanvas(canvasRef.current, image, viewerLabel, phaseRef.current);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(false);
          setError("Failed to load image.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageIndex, viewerLabel]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const intervalId = window.setInterval(() => {
      phaseRef.current += 1;

      if (canvasRef.current && imageRef.current) {
        drawPageIntoCanvas(canvasRef.current, imageRef.current, viewerLabel, phaseRef.current);
      }
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [active, viewerLabel]);

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const observer = new ResizeObserver(() => {
      if (imageRef.current) {
        drawPageIntoCanvas(canvas, imageRef.current, viewerLabel, phaseRef.current);
      }
    });

    observer.observe(canvas);

    drawPageIntoCanvas(canvas, imageRef.current, viewerLabel, phaseRef.current);

    return () => observer.disconnect();
  }, [ready, viewerLabel]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black px-6 text-center text-white">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.34em] text-stone-400">Render Error</p>
          <p className="text-sm text-stone-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-black">
      {!ready ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_42%)]">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-white/[0.04] to-transparent" />
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        aria-label={`${title} page ${pageIndex + 1}`}
        className={`h-full w-full select-none touch-none ${ready ? "opacity-100" : "opacity-0"}`}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
      />
    </div>
  );
});
