import Link from "next/link";
import { getAllRaces } from "@/lib/races";

export default function Running() {
  const races = getAllRaces();

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight text-fg">Running</h1>
        <div className="mt-8 flex flex-col gap-6">
          {races.map((race) => (
            <div key={race.slug} className="border-b border-fg/10 pb-4">
              <Link
                href={`/running/${race.slug}`}
                className="group block"
              >
                <p
                  className={`text-lg font-bold group-hover:underline ${
                    race.recap ? "text-fg" : "text-fg/40"
                  }`}
                >
                  {race.title}
                </p>
                <p className="mt-1 text-sm text-fg/50">
                  {race.date} &middot; {race.distance} &middot; {race.time}
                  {race.elevation && (
                    <> &middot; {race.elevation} gain</>
                  )}
                </p>
              </Link>
              {race.strava && (
                <a
                  href={race.strava}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
                >
                  strava
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
