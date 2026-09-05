import Link from "next/link";
import type { Metadata } from "next";

const VIDEO_ID = "6ooWgDxBRIY";

export const metadata: Metadata = {
  title: "Leadville 100 — Race Video",
  description:
    "A video of me, Brooks and Sadie throughout the 2026 Leadville Trail 100.",
  openGraph: {
    title: "Leadville 100 — Race Video",
    description:
      "A video of me, Brooks and Sadie throughout the 2026 Leadville Trail 100.",
    type: "video.other",
    images: [`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`],
  },
};

export default function LeadvilleVideo() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <article className="w-full max-w-3xl">
        <Link
          href="/running/leadville-100-2026"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; Leadville Trail 100
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg">
          Leadville 100 2026
        </h1>
        <p className="mt-2 text-sm text-fg/50">
          2026-08-22 &middot; 100.58 mi &middot; 25:35:06 &middot;{" "}
          <a
            href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-fg"
          >
            watch on youtube
          </a>
        </p>
        <p className="mt-4 text-fg/80">
          A video of me, Brooks and Sadie throughout the race.
        </p>

        <div className="mt-6 aspect-video w-full">
          <iframe
            className="h-full w-full rounded"
            src={`https://www.youtube.com/embed/${VIDEO_ID}`}
            title="Leadville 100 2026"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p className="mt-8 text-sm text-fg/50">
          The written recap lives on the{" "}
          <Link
            href="/running/leadville-100-2026"
            className="underline underline-offset-4 hover:text-fg"
          >
            race page
          </Link>
          , with more in the{" "}
          <Link
            href="/running/leadville-100-2026/afterthoughts"
            className="underline underline-offset-4 hover:text-fg"
          >
            afterthoughts
          </Link>
          .
        </p>
      </article>
    </main>
  );
}
