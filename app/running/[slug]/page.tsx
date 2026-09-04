import { getAllRaces, getRace } from "@/lib/races";
import VideoPlayOverlay from "./video-play-overlay";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllRaces().map((race) => ({ slug: race.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const race = await getRace(slug);
  const bits = [race.distance, race.time, race.elevation && `${race.elevation} gain`]
    .filter(Boolean)
    .join(" · ");
  const description = `${race.date} · ${bits}`;
  return {
    title: race.title,
    description,
    openGraph: {
      title: race.title,
      description,
      type: "article",
    },
  };
}

export default async function RacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const race = await getRace(slug);

  const meta: ReactNode[] = [
    race.date,
    race.distance,
    race.time,
    race.elevation && `${race.elevation} gain`,
  ].filter(Boolean);
  if (race.strava) {
    meta.push(
      <a
        href={race.strava}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:text-fg"
      >
        strava
      </a>
    );
  }
  if (race.gpx) {
    meta.push(
      <Link
        href={`/running/${slug}/gpx`}
        className="underline underline-offset-4 hover:text-fg"
      >
        route
      </Link>
    );
  }
  if (slug === "leadville-100-2026") {
    meta.push(
      <Link
        href={`/running/${slug}/crew`}
        className="underline underline-offset-4 hover:text-fg"
      >
        crew &amp; fueling guide
      </Link>
    );
    meta.push(
      <Link
        href={`/running/${slug}/afterthoughts`}
        className="underline underline-offset-4 hover:text-fg"
      >
        afterthoughts
      </Link>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <article className="w-full max-w-2xl">
        <Link
          href="/running"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; all races
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg">
          {race.title}
        </h1>
        <p className="mt-2 text-sm text-fg/50">
          {meta.map((part, i) => (
            <Fragment key={i}>
              {i > 0 && " · "}
              {part}
            </Fragment>
          ))}
        </p>
        {race.recap ? (
          <>
            <div
              className="prose mt-8 text-fg/80 prose-a:text-fg prose-a:underline prose-p:mb-6 prose-img:my-8 prose-img:max-h-[40rem] prose-img:w-auto prose-img:mx-auto prose-h2:text-xl prose-h2:font-bold prose-h2:text-fg prose-h2:mt-10 prose-h2:mb-4"
              dangerouslySetInnerHTML={{ __html: race.contentHtml }}
            />
            <VideoPlayOverlay />
          </>
        ) : (
          <p className="mt-8 text-fg/50 italic">recap coming soon</p>
        )}
      </article>
    </main>
  );
}
