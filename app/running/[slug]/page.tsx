import { getAllRaces, getRace } from "@/lib/races";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllRaces().map((race) => ({ slug: race.slug }));
}

export default async function RacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const race = await getRace(slug);

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
          {race.date} &middot; {race.distance} &middot; {race.time}
          {race.elevation && (
            <> &middot; {race.elevation} gain</>
          )}
          {race.strava && (
            <>
              {" "}&middot;{" "}
              <a
                href={race.strava}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-fg"
              >
                strava
              </a>
            </>
          )}
          {race.gpx && (
            <>
              {" "}&middot;{" "}
              <Link
                href={`/running/${slug}/gpx`}
                className="underline underline-offset-4 hover:text-fg"
              >
                route
              </Link>
            </>
          )}
        </p>
        {race.recap ? (
          <div
            className="prose mt-8 text-fg/80 prose-a:text-fg prose-a:underline prose-p:mb-6 prose-img:my-8 prose-img:max-h-[40rem] prose-img:w-auto prose-img:mx-auto prose-h2:text-xl prose-h2:font-bold prose-h2:text-fg prose-h2:mt-10 prose-h2:mb-4"
            dangerouslySetInnerHTML={{ __html: race.contentHtml }}
          />
        ) : (
          <p className="mt-8 text-fg/50 italic">recap coming soon</p>
        )}
      </article>
    </main>
  );
}
