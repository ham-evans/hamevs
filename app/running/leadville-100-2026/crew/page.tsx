import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadville 100 — Crew Guide",
  description:
    "Aid station crew and pacer access, cutoffs, and logistics for the 2026 Leadville Trail 100 Run (post-Willow-Fire course).",
};

type Leg = { d: number; up: number; dn: number }; // to next stop: miles, +ft, −ft

type Stop = {
  mile: string;
  name: string;
  gps?: [number, number];
  crew: "yes" | "no" | "shuttle" | "crew-only" | "n/a";
  pacer: string; // who's on the leg leaving this stop: name, "solo", or "—"
  pacerStart?: boolean; // this pacer joins here
  leg?: Leg; // distance + climb to the next stop
  cutoff?: string;
  stop?: string; // planned aid-station dwell
  dropBag?: boolean; // one of the five drop-bag stops
  target?: string; // 24:45 projection — arrival clock time
  safe?: string; // 27 hr projection — arrival clock time
  note?: string;
  gear?: { label: string; items: string[] }[]; // what crew brings to this stop
};

// 2026 COURSE. The Willow Fire closed Hagerman Pass Road, Sugarloaf and Powerline, so the
// race replaced the classic May Queen → Powerline → Outward Bound section with an
// out-and-back around Turquoise Lake. Miles, cutoffs and crew rules below are the race's
// published 2026 figures (leadvilleraceseries.com). Leg distance and climb are measured
// from the official 2026 RideWithGPS track.
//
// Watch out when cross-checking the race site: it still carries last year's aid-station
// list further down the same page — that stale block is where "May Queen aid station" and
// "pacers from mile 61.8" come from. Neither applies in 2026.
//
// Projection: leg times are grade-adjusted equivalent-flat-miles (distance, plus climb at
// 700 ft/mi and descent at 3,000 ft/mi), scaled by a per-leg terrain/altitude factor and a
// fatigue ramp that grows to 1.35× by mile 100, then normalised to 24 hr 45 min (target)
// and 27 hr (safe) finishes. The target line is deliberately 15 min inside the sub-25
// big-buckle mark, so a bad patch late doesn't cost the buckle. Times are ARRIVAL clock
// time from the 4:00 AM Sat start; "stop" is planned aid dwell (62 min total, already
// included downstream). ±20–30 min.
const stops: Stop[] = [
  { mile: "0.0", name: "Start — 6th & Harrison", crew: "yes", pacer: "solo", leg: { d: 10.6, up: 1509, dn: 963 }, cutoff: "4:00 AM Sat", target: "4:00a", safe: "4:00a", note: "Athletes must park at the Rodeo Grounds, Intermediate School or High School and shuttle/walk to the line. Start-line shuttles run 3:00–4:30 AM.", gear: [{ label: "Must bring to the start", items: ["Headlamp", "Rain jacket", "Beanie", "Tailwind packet", "Long-sleeve shirt?"] }] },
  { mile: "10.6", name: "Carter Summit — mini aid", gps: [39.28466, -106.40559], crew: "no", pacer: "solo", leg: { d: 9.9, up: 946, dn: 1738 }, stop: "1m", target: "5:51a", safe: "6:02a", note: "New for 2026, on the north side of Turquoise Lake. Mini aid, outbound only — the course does not come back through here. No crew. Then the longest unsupported stretch of the first half: 9.9 mi to the Dam." },
  { mile: "20.5", dropBag: true, name: "Turquoise Lake Dam (out)", gps: [39.252, -106.36636], crew: "no", pacer: "solo", leg: { d: 5.4, up: 158, dn: 517 }, cutoff: "10:15 AM", stop: "2m", target: "7:40a", safe: "8:01a", note: "New for 2026. Stocked aid station. NO CREW OUTBOUND." },
  { mile: "26.0", dropBag: true, name: "Outward Bound (out)", gps: [39.222625, -106.369214], crew: "yes", pacer: "solo", leg: { d: 3.6, up: 188, dn: 84 }, cutoff: "11:15 AM", stop: "5m", target: "8:34a", safe: "9:00a", note: "Crew Location 1, and the hub of the day. No crewing or parking restrictions — bring everything. Setup from 5:00 AM." },
  { mile: "29.6", name: "Pipeline (out)", gps: [39.189052, -106.374687], crew: "crew-only", pacer: "solo", leg: { d: 2.3, up: 212, dn: 65 }, cutoff: "12:15 PM ⚠", stop: "2m", target: "9:15a", safe: "9:44a", note: "Crew Location 2 (“Pipeline Alternate”), where the trail crosses the road. Crewing point only — NO aid station in 2026. No parking restrictions, setup from 5:00 AM." },
  { mile: "31.8", dropBag: true, name: "Half Pipe (out)", gps: [39.1609972, -106.3683254], crew: "no", pacer: "solo", leg: { d: 8.7, up: 1657, dn: 2209 }, cutoff: "12:15 PM ⚠", stop: "3m", target: "9:42a", safe: "10:13a", note: "Stocked aid station, but not a crew location." },
  { mile: "40.5", dropBag: true, name: "Twin Lakes Village (out)", gps: [39.0828842, -106.3833776], crew: "shuttle", pacer: "solo", leg: { d: 5.1, up: 2746, dn: 124 }, cutoff: "2:15 PM", stop: "10m", target: "11:47a", safe: "12:30p", note: "Shuttle only, no driving access: crew park at Outward Bound and ride in. Crew wristbands required. Bring only what fits in your lap on the shuttle.", gear: [{ label: "Must bring to Twin Lakes out", items: ["POLES — do not forget the poles here", "Rain jacket", "Long-sleeve shirt as an option, in a ziploc with socks", "Small headlamp too, just in case"] }, { label: "Must bring for Twin Lakes in (mile 64.2) — same shuttle trip", items: ["Patagonia jacket", "Arc'teryx beanie", "Gloves", "Long-sleeve shirt", "Short-sleeve shirt", "Bandit half tights", "Patagonia running tights", "Socks", "Backup shoes", "Running belt + bottle", "Headlamps ×2 — bring all 3"] }, { label: "Twin Lakes in — pacer carries", items: ["Charging pack", "iPhone + watch charger"] }] },
  { mile: "45.6", name: "Hope Pass (out)", gps: [39.0264753, -106.4023486], crew: "no", pacer: "solo", leg: { d: 6.7, up: 1386, dn: 3015 }, cutoff: "4:45 PM", stop: "3m", target: "1:54p", safe: "2:48p", note: "No crew. Do not start the round trip to Hope Pass without warm and protective clothing regardless of the weather in town." },
  { mile: "52.3", dropBag: true, name: "Winfield — turnaround", gps: [38.9833322, -106.4402536], crew: "no", pacer: "solo", leg: { d: 6.7, up: 3016, dn: 1386 }, cutoff: "6:50 PM", stop: "10m", target: "4:02p", safe: "5:08p", note: "No crew, no pacers." },
  { mile: "59.1", name: "Hope Pass (in)", gps: [39.0264753, -106.4023486], crew: "no", pacer: "solo", leg: { d: 5.1, up: 123, dn: 2744 }, stop: "3m", target: "6:48p", safe: "8:09p", note: "The crux. Second crossing at 12,500+ ft, then a 2,700 ft descent to Twin Lakes. Likely the last leg in daylight — carry the headlamp before you need it." },
  { mile: "64.2", dropBag: true, name: "Twin Lakes Village (in)", gps: [39.0828842, -106.3833776], crew: "shuttle", pacer: "Brooks", pacerStart: true, leg: { d: 8.7, up: 2211, dn: 1659 }, cutoff: "11:00 PM", stop: "10m", target: "8:11p", safe: "9:40p", note: "Pacers may join here and NOT before — this is mile 64.2 on the 2026 course, not the 61.8 the stale section of the race site still quotes. Two pacer bibs come in the packet; extra bibs and waivers are available here, at Outward Bound and at Turquoise Lake Dam, but NOT at Pipeline. One pacer at a time until mile 99, then a second may join for the final mile. Pacers can carry gear but cannot push, pull, carry or tow. Brooks picks up here for the 20.0 mi to Turquoise Lake Dam — the whole night section. Night gear goes on here. Crew shuttles stop running at 11:00 PM, so a slow split strands the crew." },
  { mile: "72.8", dropBag: true, name: "Half Pipe (in)", gps: [39.1609972, -106.3683254], crew: "no", pacer: "Brooks", leg: { d: 2.3, up: 65, dn: 212 }, cutoff: "2:00 AM Sun", stop: "3m", target: "10:44p", safe: "12:25a Su" },
  { mile: "75.1", name: "Pipeline (in)", gps: [39.189052, -106.374687], crew: "crew-only", pacer: "Brooks", leg: { d: 3.6, up: 83, dn: 192 }, stop: "2m", target: "11:12p", safe: "12:57a Su", note: "Crew handoffs only, no aid. No pacer-bib pickup here — a pacer swapping in must already have the bib." },
  { mile: "78.7", dropBag: true, name: "Outward Bound (in)", gps: [39.222625, -106.369214], crew: "yes", pacer: "Brooks", leg: { d: 5.5, up: 540, dn: 164 }, cutoff: "3:45 AM Sun", stop: "5m", target: "11:54p", safe: "1:43a Su", note: "Last crew location on the course, and the last stop with parking. Everything after this is 21.2 mi with one aid station and no driving access, so this is the crew's final chance to hand over anything heavy." },
  { mile: "84.2", dropBag: true, name: "Turquoise Lake Dam (in)", gps: [39.25274, -106.36612], crew: "no", pacer: "Sadie", pacerStart: true, leg: { d: 15.7, up: 1849, dn: 1615 }, cutoff: "5:30 AM Sun", stop: "3m", target: "1:07a Su", safe: "3:02a Su", note: "Sadie takes over here. Last aid station on the course — and then 15.7 mi with +1,849 ft to the finish, the longest unsupported leg of the race by a wide margin, climbing back to ~10,700 ft on the north lake road before dropping into town. Leave here carrying everything. Crew cannot set up at this stop, so the swap is pacer-to-pacer with only the aid station around. On the old course this handoff was at May Queen (87.4), which no longer exists. Getting Sadie here is the open logistics problem: the Dam is a pacer-transport location and a bib pickup point, so pacers are clearly expected — but the race says no driving access, use the shuttle from Outward Bound, and the only published shuttle runs Outward Bound ↔ Twin Lakes until 11:00 PM, hours before the projection puts the runner here. Either there is a pacer shuttle the site doesn’t document, or Sadie needs to get in before the shuttles stop and wait several hours at ~9,900 ft — which means warm layers, a chair and a plan, not a last-minute decision. Ask at the Friday athlete meeting." },
  { mile: "99.9", name: "Finish — 6th & Harrison", crew: "yes", pacer: "—", cutoff: "10:00 AM Sun", target: "4:45a Su", safe: "7:00a Su", note: "Big buckle sub-25 hr (5:00 AM Sun), small buckle and official cutoff sub-30 hr (10:00 AM Sun). The target column runs to a 24:45 finish (4:45 AM Sun) — 15 min of buffer against the buckle. Buckles are on chip time; cutoffs are on gun time. A second pacer may join for the final mile." },
];

const crewLabel: Record<Exclude<Stop["crew"], "n/a">, { text: string; cls: string }> = {
  yes: { text: "Crew", cls: "bg-emerald-600/15 text-emerald-800" },
  "crew-only": { text: "Crew only", cls: "bg-emerald-600/15 text-emerald-800" },
  shuttle: { text: "Crew (shuttle)", cls: "bg-amber-500/20 text-amber-800" },
  no: { text: "No crew", cls: "bg-red-600/15 text-red-800" },
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

// Anchor for the stop-by-stop section, so a tap on the mobile summary jumps to the detail.
const stopId = (s: Stop) => `stop-${s.mile.replace(".", "-")}`;

function Gain({ up, dn }: { up: number; dn: number }) {
  return (
    <>
      <span className="text-emerald-700">&uarr;{up.toLocaleString("en-US")}</span>{" "}
      <span className="text-red-700">&darr;{dn.toLocaleString("en-US")}</span>
    </>
  );
}

export default function CrewGuide() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 py-16 sm:px-6 sm:py-24">
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
          Aug 22, 2026 &middot; 99.9 mi &middot; 4:00 AM start &middot;{" "}
          <Link
            href="/running/leadville-100-2026/gpx"
            className="underline underline-offset-4 hover:text-fg"
          >
            route
          </Link>
        </p>
      </div>

      {/* Phone — ten columns will not fit, so the same rows stack. Tap jumps to the detail. */}
      <div className="mt-10 w-full max-w-3xl divide-y divide-fg/10 border-y border-fg/15 md:hidden">
        {stops.map((s, i) => {
          const legIn = i > 0 ? stops[i - 1].leg : undefined; // segment into this stop
          return (
            <a
              key={s.mile + s.name}
              href={`#${stopId(s)}`}
              className="flex flex-col gap-2 py-3.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold leading-snug text-fg">{s.name}</span>
                <span className="shrink-0 tabular-nums text-xs text-fg/40">
                  mi {s.mile}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg/50">
                {s.target && (
                  <span className="tabular-nums">
                    target <span className="font-bold text-fg">{s.target}</span>
                  </span>
                )}
                {s.safe && (
                  <span className="tabular-nums">
                    safe <span className="text-fg/70">{s.safe}</span>
                  </span>
                )}
                {s.cutoff && (
                  <span className="tabular-nums">
                    cutoff <span className="text-fg/70">{s.cutoff}</span>
                  </span>
                )}
                {legIn && (
                  <span className="whitespace-nowrap tabular-nums">
                    {legIn.d.toFixed(1)} mi <Gain up={legIn.up} dn={legIn.dn} />
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {s.crew !== "n/a" && <Badge {...crewLabel[s.crew]} />}
                {s.dropBag && (
                  <Badge text="Drop bag" cls="bg-violet-600/15 text-violet-800" />
                )}
                <Badge {...pacerBadge(s.pacer, s.pacerStart)} />
              </div>
            </a>
          );
        })}
      </div>

      {/* Table — breaks out wider than the prose */}
      <div className="mt-14 hidden w-full max-w-6xl overflow-x-auto md:block">
        <table className="w-full border-collapse text-center text-sm">
          <thead>
            <tr className="border-b border-fg/20 text-center text-fg/50">
              <th className="py-2 px-3 font-bold">Mile</th>
              <th className="py-2 px-4 font-bold">Aid Station</th>
              <th className="py-2 px-3 font-bold">This leg</th>
              <th className="py-2 px-3 font-bold">Climb</th>
              <th className="py-2 px-3 font-bold">24:45&nbsp;target</th>
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
                    <Gain up={legIn.up} dn={legIn.dn} />
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
                  {s.crew === "n/a" ? (
                    <span className="text-fg/30">—</span>
                  ) : (
                    <Badge {...crewLabel[s.crew]} />
                  )}
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
        {/* Every stop, in course order — the whole guide lives here */}
        <h2 className="mt-16 text-xs font-bold uppercase tracking-widest text-fg/40 sm:mt-24">
          Stop by stop
        </h2>
        <div className="mt-6 divide-y divide-fg/15">
          {stops.map((s, i) => {
            const legIn = i > 0 ? stops[i - 1].leg : undefined;
            return (
              <section
                key={s.mile + s.name}
                id={stopId(s)}
                className="scroll-mt-6 py-9 sm:py-12"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-bold tracking-tight text-fg sm:text-xl">
                    {s.name}
                  </h3>
                  <span className="shrink-0 tabular-nums text-sm text-fg/40">
                    mile {s.mile}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg/50">
                  {s.crew !== "n/a" && <Badge {...crewLabel[s.crew]} />}
                  {s.dropBag && (
                    <Badge text="Drop bag" cls="bg-violet-600/15 text-violet-800" />
                  )}
                  <Badge {...pacerBadge(s.pacer, s.pacerStart)} />
                  {s.target && (
                    <span className="tabular-nums">
                      target <span className="font-bold text-fg">{s.target}</span>
                    </span>
                  )}
                  {s.safe && (
                    <span className="tabular-nums">
                      safe <span className="text-fg/70">{s.safe}</span>
                    </span>
                  )}
                  {s.cutoff && (
                    <span className="tabular-nums">
                      cutoff <span className="text-fg/70">{s.cutoff}</span>
                    </span>
                  )}
                  {s.stop && <span>stop ~{s.stop.replace("m", " min")}</span>}
                  {legIn && (
                    <span className="whitespace-nowrap tabular-nums">
                      {legIn.d.toFixed(1)} mi in <Gain up={legIn.up} dn={legIn.dn} />
                    </span>
                  )}
                  {s.gps && (
                    <a
                      href={`https://www.google.com/maps?q=${s.gps[0]},${s.gps[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-fg"
                    >
                      map
                    </a>
                  )}
                </div>

                {s.note && <p className="mt-5 text-fg/80">{s.note}</p>}

                {s.gear?.map((list) => (
                  <div key={list.label} className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-fg/40">
                      {list.label}
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-fg/80">
                      {list.items.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          })}
        </div>

      </div>
    </main>
  );
}
