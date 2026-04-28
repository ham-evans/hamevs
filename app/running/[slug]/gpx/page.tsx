import { getAllRaces, getRace } from "@/lib/races";
import Link from "next/link";
import RaceGpxClient from "./client";

export async function generateStaticParams() {
  return getAllRaces()
    .filter((race) => race.gpx)
    .map((race) => ({ slug: race.slug }));
}

export default async function RaceGpxPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const race = await getRace(slug);

  if (!race.gpx) {
    return (
      <main className="flex flex-1 flex-col items-center px-6 py-24">
        <div className="w-full max-w-2xl">
          <Link
            href={`/running/${slug}`}
            className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
          >
            &larr; back to recap
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg">
            {race.title}
          </h1>
          <p className="mt-6 text-fg/50 italic">no route available for this race</p>
        </div>
      </main>
    );
  }

  return (
    <RaceGpxClient
      slug={slug}
      title={race.title}
      src={`/race-routes/${race.gpx}`}
    />
  );
}
