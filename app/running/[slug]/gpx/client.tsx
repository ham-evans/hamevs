"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GpxViewer from "@/app/gpx/viewer";
import { parseGpx, type GpxData } from "@/lib/gpx";

interface Props {
  slug: string;
  title: string;
  src: string;
}

export default function RaceGpxClient({ slug, title, src }: Props) {
  const [data, setData] = useState<GpxData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load GPX (${r.status})`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = parseGpx(text);
        if (parsed.points.length === 0) {
          setError("No track points in GPX file.");
          return;
        }
        setData(parsed);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  const backLink = (
    <Link
      href={`/running/${slug}`}
      className="text-xs text-fg/50 underline underline-offset-4 hover:text-fg shrink-0"
    >
      &larr; {title}
    </Link>
  );

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center px-6 py-24">
        <div className="w-full max-w-2xl">
          <Link
            href={`/running/${slug}`}
            className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
          >
            &larr; back to recap
          </Link>
          <p className="mt-8 text-sm text-fg/40 italic">
            Could not load route: {error}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="h-72 w-full max-w-3xl mx-6 animate-pulse rounded border border-fg/10 bg-fg/5" />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center">
      <GpxViewer gpxData={data} headerLeading={backLink} />
    </main>
  );
}
