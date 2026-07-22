import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadville 100 — Crew Guide",
  description:
    "Aid station crew and pacer access, cutoffs, and logistics for the Leadville Trail 100 Run.",
};

type Leg = { d: number; up: number; dn: number }; // to next stop: miles, +ft, −ft

type Stop = {
  mile: string;
  name: string;
  gps?: [number, number];
  crew: "yes" | "no" | "dq" | "shuttle" | "crew-only";
  pacer: string; // who's on the leg leaving this stop: name, "solo", or "—"
  pacerStart?: boolean; // this pacer joins here
  leg?: Leg; // distance + climb to the next stop
  cutoff?: string;
  stop?: string; // planned aid-station dwell
  target?: string; // 25 hr projection — arrival clock time
  safe?: string; // 27 hr projection — arrival clock time
  note?: string;
};

// Access rules + cutoffs from the Leadville Race Series 2024 Athlete Guide and
// 2024 pacer/crew update. Miles marked "~" are measured from the GPX track; the
// rest are the race's published figures. Verify against the 2026 guide first.
// Leg distance + climb are measured from the GPX (sum to 16,762 ft / 99.5 mi).
//
// Projection: a grade-adjusted pace model built from Ham's own Silver Rush 50
// (same altitude/series) and Canyons 100k GPS splits, applied to the Leadville
// elevation profile, then anchored to the empirical Silver Rush ×2.4–2.6 →
// Leadville relationship (NOT road-Riegel, which runs ~2h fast). Scaled to
// 25 hr (target) and 27 hr (safe) finishes. Columns show ARRIVAL clock time
// from a 4:00 AM Sat start; the Stop column is planned aid dwell (64 min total,
// already included downstream). Winfield lands at ~46% of moving time. ±20–30 min.
const stops: Stop[] = [
  { mile: "0.0", name: "Start — 6th & Harrison", crew: "no", pacer: "solo", leg: { d: 12.4, up: 870, dn: 1060 }, cutoff: "4:00 AM Sat", target: "4:00a", safe: "4:00a" },
  { mile: "12.6", name: "May Queen (out)", crew: "dq", pacer: "solo", leg: { d: 10.9, up: 1590, dn: 2010 }, cutoff: "7:45 AM", stop: "3m", target: "6:18a", safe: "6:29a", note: "Crew INBOUND ONLY — no crew outbound. Crewing here in the morning is a DQ (crew allowed from 5 PM only). Stocked aid station." },
  { mile: "23.5", name: "Outward Bound (out)", gps: [39.2225487, -106.3744369], crew: "yes", pacer: "solo", leg: { d: 3.6, up: 190, dn: 80 }, cutoff: "10:00 AM", stop: "5m", target: "8:34a", safe: "8:56a", note: "First crew stop. Also shuttle location for Twin Lakes crew stop." },
  { mile: "~26.9", name: "Pipeline (out)", gps: [39.1897241, -106.3751113], crew: "crew-only", pacer: "solo", leg: { d: 2.3, up: 200, dn: 50 }, stop: "2m", target: "9:18a", safe: "9:44a", note: "A spot where the trail crosses the road, so crew can drive up and meet you. Crew access point, no official aid station — handoffs only." },
  { mile: "29.3", name: "Half Pipe (out)", crew: "no", pacer: "solo", leg: { d: 8.6, up: 1480, dn: 2030 }, cutoff: "11:30 AM", stop: "3m", target: "9:51a", safe: "10:19a" },
  { mile: "37.9", name: "Twin Lakes (out)", gps: [39.0829367, -106.3836188], crew: "shuttle", pacer: "solo", leg: { d: 5.3, up: 2780, dn: 160 }, cutoff: "1:30 PM", stop: "10m", target: "11:47a", safe: "12:25p", note: "No crew driving access — park at Outward Bound and shuttle in. Most important stop; gear up for Hope Pass." },
  { mile: "43.5", name: "Hope Pass (out)", crew: "no", pacer: "solo", leg: { d: 6.8, up: 1430, dn: 3060 }, cutoff: "4:00 PM", stop: "3m", target: "1:42p", safe: "2:29p", note: "12,000 ft, llama-supplied. 4:30 PM safety cutoff to make Winfield." },
  { mile: "50.0", name: "Winfield — turnaround", crew: "no", pacer: "solo", leg: { d: 6.8, up: 3030, dn: 1400 }, cutoff: "6:00 PM", stop: "10m", target: "3:20p", safe: "4:15p", note: "No crew, spectators, or pacers. Cut-off athletes shuttle back to Twin Lakes." },
  { mile: "~56.5", name: "Hope Pass (in)", crew: "no", pacer: "solo", leg: { d: 5.1, up: 90, dn: 2720 }, stop: "3m", target: "5:28p", safe: "6:32p", note: "Second Hope Pass crossing — the crux of the race. 12,600 ft summit, then the long descent to Twin Lakes. No crew, llama-supplied." },
  { mile: "62.5", name: "Twin Lakes (in)", gps: [39.0829367, -106.3836188], crew: "shuttle", pacer: "Brooks", pacerStart: true, leg: { d: 8.5, up: 1800, dn: 1250 }, cutoff: "10:15 PM", stop: "10m", target: "6:51p", safe: "8:03p", note: "Pacers may join here — not before. Shuttle-only crew access. Pick up night gear. Brooks paces from here to May Queen (in)." },
  { mile: "~70.7", name: "Half Pipe (in)", crew: "no", pacer: "Brooks", leg: { d: 2.4, up: 50, dn: 190 }, cutoff: "1:15 AM", stop: "3m", target: "9:07p", safe: "10:29p" },
  { mile: "~73.1", name: "Pipeline (in)", gps: [39.1897241, -106.3751113], crew: "crew-only", pacer: "Brooks", leg: { d: 3.6, up: 80, dn: 190 }, stop: "2m", target: "9:43p", safe: "11:07p", note: "Crew access point, no official aid station — handoffs only." },
  { mile: "76.9", name: "Outward Bound (in)", gps: [39.2225487, -106.3744369], crew: "yes", pacer: "Brooks", leg: { d: 10.9, up: 2050, dn: 1640 }, cutoff: "3:00 AM", stop: "5m", target: "10:36p", safe: "12:05a Su", note: "Full crew access." },
  { mile: "87.4", name: "May Queen (in)", gps: [39.2813255, -106.4406838], crew: "yes", pacer: "Sadie", pacerStart: true, leg: { d: 12.4, up: 1130, dn: 940 }, cutoff: "6:30 AM", stop: "5m", target: "1:36a Su", safe: "3:20a Su", note: "One-way clockwise traffic around the lake. Last stop before the finish push. Sadie paces to the finish." },
  { mile: "100.0", name: "Finish", crew: "no", pacer: "—", cutoff: "10:00 AM", target: "5:00a Su", safe: "7:00a Su" },
];

const crewLabel: Record<Stop["crew"], { text: string; cls: string }> = {
  yes: { text: "Crew", cls: "bg-emerald-600/15 text-emerald-800" },
  "crew-only": { text: "Crew only", cls: "bg-emerald-600/15 text-emerald-800" },
  shuttle: { text: "Crew (shuttle)", cls: "bg-amber-500/20 text-amber-800" },
  dq: { text: "No crew (DQ)", cls: "bg-red-600/15 text-red-800" },
  no: { text: "No crew", cls: "bg-fg/5 text-fg/40" },
};

function pacerBadge(pacer: string, start?: boolean): { text: string; cls: string } {
  if (pacer === "—") return { text: "—", cls: "text-fg/30" };
  if (pacer === "solo") return { text: "solo", cls: "bg-fg/5 text-fg/40" };
  return {
    text: start ? `${pacer} joins` : pacer,
    cls: start
      ? "bg-sky-600/25 text-sky-900 font-bold"
      : "bg-sky-600/15 text-sky-800",
  };
}

function Badge({ text, cls }: { text: string; cls: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-xs ${cls}`}>
      {text}
    </span>
  );
}

export default function CrewGuide() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-3xl">
        <Link
          href="/running/leadville-100-2026"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; Leadville Trail 100
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg">
          Leadville 100 — Crew Guide
        </h1>
        <p className="mt-2 text-sm text-fg/50">
          Aug 22, 2026 &middot; 100 mi &middot; 4:00 AM start &middot;{" "}
          <Link
            href="/running/leadville-100-2026/gpx"
            className="underline underline-offset-4 hover:text-fg"
          >
            route
          </Link>
        </p>
      </div>

      {/* Table — breaks out wider than the prose */}
      <div className="mt-8 w-full max-w-6xl overflow-x-auto">
        <table className="w-full border-collapse text-center text-sm">
          <thead>
            <tr className="border-b border-fg/20 text-center text-fg/50">
              <th className="py-2 px-3 font-bold">Mile</th>
              <th className="py-2 px-4 font-bold">Aid Station</th>
              <th className="py-2 px-3 font-bold">This leg</th>
              <th className="py-2 px-3 font-bold">Climb</th>
              <th className="py-2 px-3 font-bold">25h&nbsp;target</th>
              <th className="py-2 px-3 font-bold">27h&nbsp;safe</th>
              <th className="py-2 px-3 font-bold">Cutoff</th>
              <th className="py-2 px-3 font-bold">Crew</th>
              <th className="py-2 px-3 font-bold">Pacer</th>
              <th className="py-2 font-bold">Maps</th>
            </tr>
          </thead>
          <tbody>
            {stops.map((s, i) => {
              const legIn = i > 0 ? stops[i - 1].leg : undefined; // segment into this stop
              return (
              <tr
                key={s.mile + s.name}
                className={`border-b border-fg/10 align-middle ${
                  i % 2 === 1 ? "bg-fg/[0.02]" : ""
                }`}
              >
                <td className="py-3 px-3 tabular-nums text-fg/60">{s.mile}</td>
                <td className="py-3 px-4 font-bold text-fg">{s.name}</td>
                <td className="py-3 px-3 tabular-nums text-fg/60">
                  {legIn ? legIn.d.toFixed(1) : <span className="text-fg/30">—</span>}
                </td>
                <td className="py-3 px-3 whitespace-nowrap tabular-nums">
                  {legIn ? (
                    <>
                      <span className="text-emerald-700">
                        &uarr;{legIn.up.toLocaleString("en-US")}
                      </span>{" "}
                      <span className="text-red-700">
                        &darr;{legIn.dn.toLocaleString("en-US")}
                      </span>
                    </>
                  ) : (
                    <span className="text-fg/30">—</span>
                  )}
                </td>
                <td className="py-3 px-3 tabular-nums font-bold text-fg">
                  {s.target ?? <span className="text-fg/30">—</span>}
                </td>
                <td className="py-3 px-3 tabular-nums text-fg/70">
                  {s.safe ?? <span className="text-fg/30">—</span>}
                </td>
                <td className="py-3 px-3 tabular-nums text-fg/50">
                  {s.cutoff ?? <span className="text-fg/30">—</span>}
                </td>
                <td className="py-3 px-3">
                  <Badge {...crewLabel[s.crew]} />
                </td>
                <td className="py-3 px-3">
                  <Badge {...pacerBadge(s.pacer, s.pacerStart)} />
                </td>
                <td className="py-3">
                  {s.gps ? (
                    <a
                      href={`https://www.google.com/maps?q=${s.gps[0]},${s.gps[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-fg text-fg/60"
                    >
                      map
                    </a>
                  ) : (
                    <span className="text-fg/30">—</span>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-3xl">
        {/* Key logistics */}
        <h2 className="mt-12 text-xl font-bold text-fg">Twin Lakes — the one that matters</h2>
        <div className="mt-4 space-y-5 text-fg/80">
          <p>
            <span className="font-bold text-fg">Twin Lakes has no crew driving access — the shuttle boards at Outward Bound.</span>{" "}
            Twin Lakes Village is where crew meets the runner, but{" "}
            <span className="italic">all parking for Twin Lakes is at Outward Bound</span>{" "}
            (mile 23.5 / 76.9). 10+ shuttles loop Outward Bound &harr; Twin Lakes,
            running 5:00 AM–10:00 PM; no parking on HWY 82. Max 4 crew + 1 pacer;
            drop tents/coolers/chairs Friday (not allowed on race-day shuttles).
            This is the most important stop of the day — both Hope Pass crossings
            bracket it, and it&apos;s the hardest to reach. Full schedule + map in
            the &ldquo;Parking &amp; Shuttles&rdquo; section of the athlete guide.
          </p>
        </div>

        {/* Crew notes per stop */}
        <h2 className="mt-12 text-xl font-bold text-fg">Stop-by-stop notes</h2>
        <div className="mt-4 space-y-3 text-sm text-fg/80">
          {stops
            .filter((s) => s.note)
            .map((s) => (
              <p key={s.mile + s.name}>
                <span className="font-bold text-fg">
                  {s.name} <span className="text-fg/40">({s.mile})</span>:
                </span>{" "}
                {s.note}
                {s.stop && (
                  <span className="text-fg/50"> Planned stop ~{s.stop.replace("m", " min")}.</span>
                )}
              </p>
            ))}
        </div>

        <p className="mt-12 text-xs italic text-fg/40">
          Cutoffs and access rules are from the 2024 athlete guide and pacer/crew
          update; Leadville revises these yearly. Confirm against the 2026 guide
          before race week.
        </p>
      </div>
    </main>
  );
}
