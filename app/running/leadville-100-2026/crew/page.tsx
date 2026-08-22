import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadville 100 — Crew & Fueling Guide",
  description:
    "Stop-by-stop crew access, cutoffs, gear and fueling for the 2026 Leadville Trail 100 Run (post-Willow-Fire course).",
};

// ── What exists ──────────────────────────────────────────────────────────────
// The scoops can only be mixed where crew is: the start, Pipeline out, both
// Outward Bounds and both Twin Lakes (Pipeline inbound is being skipped). Everywhere else it's gels and Tailwind
// packs out of a drop bag, mixed with aid-station water.
type Item = "g24" | "g24caf" | "g40" | "g40na" | "g50na" | "g50caf" | "tw90";

const ITEMS: Record<Item, { carbs: number; have: number; name: string }> = {
  g24: { carbs: 24, have: 10, name: "24 g gel" },
  g24caf: { carbs: 24, have: 3, name: "24 g gel + 75 mg caffeine" },
  g40: { carbs: 40, have: 4, name: "40 g gel" },
  g40na: { carbs: 40, have: 5, name: "40 g gel + 200 mg sodium" },
  g50na: { carbs: 50, have: 6, name: "50 g gel + 200 mg sodium" },
  g50caf: { carbs: 50, have: 6, name: "50 g gel + 100 mg caffeine" },
  tw90: { carbs: 90, have: 6, name: "90 g Tailwind high-carb pack" },
};

type Load = { n: number; item: Item; how?: string };

// A bottle line is display text plus, when it consumes something out of a bag right
// here, the item it uses. Nothing on the page renders `uses` — it's the record that
// makes the placement auditable: three Tailwind packs get mixed on the spot and
// three travel dry, and that has to add up to the six in the box.
type BottleLine = { text: string; uses?: Load[] };

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
  note?: string | string[]; // array renders as separate paragraphs
  gear?: { label: string; items: string[] }[]; // what crew brings to this stop
  // Fuel, merged in from what used to be a separate page.
  carry?: Load[]; // into pockets and the pack
  bottles?: BottleLine[]; // mixed here and drunk from here
  carbScoops?: number; // 30 g high-carb scoops mixed here — crew stops only
  lyteScoops?: number; // 500 mg electrolyte scoops mixed here
  packSwap?: string; // pack/belt swaps and who mules what out of here
  food?: string;
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
  { mile: "0.0", name: "Start — 6th & Harrison", crew: "yes", pacer: "solo", leg: { d: 10.6, up: 1509, dn: 963 }, cutoff: "4:00 AM Sat", target: "4:00a", safe: "4:00a", note: "Athletes must park at the Rodeo Grounds, Intermediate School or High School and shuttle/walk to the line. Start-line shuttles run 3:00–4:30 AM.", gear: [{ label: "Must bring to the start", items: ["Headlamp", "Rain jacket", "Beanie", "Long-sleeve shirt?"] }], carry: [{ n: 2, item: "g40" }, { n: 2, item: "g40na" }, { n: 1, item: "g24" }, { n: 1, item: "tw90", how: "dry — mix it at Carter Summit, mile 10.6" }], bottles: [{ text: "Bottle 1 — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Bottle 2 — 30 g high-carb scoop only, no electrolyte — it is 4am and cold, and two sodium gels are already in the pocket" }], carbScoops: 2, lyteScoops: 1 },
  { mile: "10.6", name: "Carter Summit — mini aid", gps: [39.28466, -106.40559], crew: "no", pacer: "solo", leg: { d: 9.9, up: 946, dn: 1738 }, stop: "1m", target: "5:51a", safe: "6:02a", note: "New for 2026, on the north side of Turquoise Lake. Mini aid, outbound only — the course does not come back through here. No crew. Then the longest unsupported stretch of the first half: 9.9 mi to the Dam.", bottles: [{ text: "Refill both bottles with aid-station water" }, { text: "Mix in the 90 g Tailwind pack carried from the start" }] },
  { mile: "20.5", dropBag: true, name: "Turquoise Lake Dam (out)", gps: [39.252, -106.36636], crew: "no", pacer: "solo", leg: { d: 5.4, up: 158, dn: 517 }, cutoff: "10:15 AM", stop: "2m", target: "7:40a", safe: "8:01a", note: "New for 2026. Stocked aid station. NO CREW OUTBOUND.", carry: [{ n: 1, item: "g40" }, { n: 1, item: "g24" }], bottles: [{ text: "Refill both bottles with aid-station water" }] },
  { mile: "26.0", dropBag: true, name: "Outward Bound (out)", gps: [39.222625, -106.369214], crew: "yes", pacer: "solo", leg: { d: 3.6, up: 188, dn: 84 }, cutoff: "11:15 AM", stop: "5m", target: "8:34a", safe: "9:00a", note: "Crew Location 1, and the hub of the day. No crewing or parking restrictions — bring everything. Setup from 5:00 AM.", carry: [{ n: 1, item: "g24" }], bottles: [{ text: "Bottle 1 — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Bottle 2 — 30 g high-carb scoop + 500 mg electrolyte scoop" }], carbScoops: 2, food: "First real food if it's going down." },
  { mile: "29.6", name: "Pipeline (out)", gps: [39.189052, -106.374687], crew: "crew-only", pacer: "solo", leg: { d: 2.3, up: 212, dn: 65 }, cutoff: "12:15 PM ⚠", stop: "2m", target: "9:15a", safe: "9:44a", note: "Crew Location 2 (“Pipeline Alternate”), where the trail crosses the road. Crewing point only — NO aid station in 2026. No parking restrictions, setup from 5:00 AM.", carry: [{ n: 1, item: "g24" }], bottles: [{ text: "Top off one bottle — 30 g high-carb scoop + 500 mg electrolyte scoop" }], carbScoops: 1 },
  { mile: "31.8", dropBag: true, name: "Half Pipe (out)", gps: [39.1609972, -106.3683254], crew: "no", pacer: "solo", leg: { d: 8.7, up: 1657, dn: 2209 }, cutoff: "12:15 PM ⚠", stop: "3m", target: "9:42a", safe: "10:13a", note: "Stocked aid station, but not a crew location.", carry: [{ n: 2, item: "g50na" }], bottles: [{ text: "Bottle 1 — 90 g Tailwind pack from the bag, mixed here", uses: [{ n: 1, item: "tw90" }] }, { text: "Bottle 2 — aid-station water" }] },
  { mile: "40.5", dropBag: true, name: "Twin Lakes (out)", gps: [39.0828842, -106.3833776], crew: "shuttle", pacer: "solo", leg: { d: 5.1, up: 2746, dn: 124 }, cutoff: "2:15 PM", stop: "10m", target: "11:47a", safe: "12:30p", note: ["Shuttle only, no driving access: crew park at Outward Bound and ride in. Crew wristbands required. Bring only what fits in your lap on the shuttle.", "Definitely a sock change here, probably a shirt change. MAYBE a shoe change too."], gear: [{ label: "Must bring to Twin Lakes out", items: ["POLES — do not forget the poles here", "HEADLAMP (the purple one) — a must here, same as the poles", "Rain jacket", "Long-sleeve shirt as an option, in a ziploc with socks"] }, { label: "Must bring for Twin Lakes in (mile 64.2) — same shuttle trip", items: ["Patagonia jacket", "Arc'teryx beanie", "Gloves", "Long-sleeve shirt", "Short-sleeve shirt", "Bandit half tights", "Patagonia running tights", "Socks", "Backup shoes", "Running belt + bottle", "Headlamps ×2 — bring all 3"] }, { label: "Twin Lakes in — pacer carries", items: ["Charging pack", "iPhone + watch charger"] }], carry: [{ n: 2, item: "g50na" }, { n: 2, item: "g40na" }, { n: 1, item: "g50caf", how: "first caffeine of the race" }, { n: 1, item: "tw90", how: "dry — mix it at Hope Pass, mile 45.6" }, { n: 1, item: "g24caf", how: "take it about two hours in, not at the stop" }], bottles: [{ text: "Bottle 1 — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Bottle 2 — 500 mg electrolyte scoop only, no high-carb — the Tailwind pack covers the carbs over Hope" }], carbScoops: 1, lyteScoops: 2, food: "Sandwich, quesadilla, wrap — whatever the aid station has that isn't dry. Real food starts here and never stops." },
  { mile: "45.6", name: "Hope Pass (out)", gps: [39.0264753, -106.4023486], crew: "no", pacer: "solo", leg: { d: 6.7, up: 1386, dn: 3015 }, cutoff: "4:45 PM", stop: "3m", target: "1:54p", safe: "2:48p", note: "No crew. Do not start the round trip to Hope Pass without warm and protective clothing regardless of the weather in town.", bottles: [{ text: "Refill both bottles with aid-station water" }, { text: "Mix in the 90 g Tailwind pack carried from Twin Lakes" }] },
  { mile: "52.3", dropBag: true, name: "Winfield — turnaround", gps: [38.9833322, -106.4402536], crew: "no", pacer: "solo", leg: { d: 6.7, up: 3016, dn: 1386 }, cutoff: "6:50 PM", stop: "10m", target: "4:02p", safe: "5:08p", note: "No crew, no pacers.", carry: [{ n: 2, item: "g50na" }, { n: 1, item: "g40na" }, { n: 1, item: "g24" }, { n: 1, item: "g50caf" }, { n: 1, item: "tw90", how: "dry — mix it at Hope Pass, mile 59.1" }, { n: 1, item: "g24caf", how: "take it about two hours in, not at the stop" }], bottles: [{ text: "Bottle 1 — 90 g Tailwind pack from the bag, mixed here", uses: [{ n: 1, item: "tw90" }] }, { text: "Bottle 2 — aid-station water" }] },
  { mile: "59.1", name: "Hope Pass (in)", gps: [39.0264753, -106.4023486], crew: "no", pacer: "solo", leg: { d: 5.1, up: 123, dn: 2744 }, stop: "3m", target: "6:48p", safe: "8:09p", note: "The crux. Second crossing at 12,500+ ft, then a 2,700 ft descent to Twin Lakes. Likely the last leg in daylight — carry the headlamp before you need it.", bottles: [{ text: "Refill both bottles with aid-station water" }, { text: "Mix in the 90 g Tailwind pack carried from Winfield" }] },
  { mile: "64.2", dropBag: true, name: "Twin Lakes (in)", gps: [39.0828842, -106.3833776], crew: "shuttle", pacer: "Brooks", pacerStart: true, leg: { d: 8.7, up: 2211, dn: 1659 }, cutoff: "11:00 PM", stop: "12m", target: "8:11p", safe: "9:40p", note: ["Tough love everywhere else — here I'll probably need compassion and a hug or two. I was up on this part of the trail on a Sunday and it is brutal, so coming off the second Hope crossing I’ll be beat up in the legs and in the head, and it’ll probably be dark.", "Full clothing change, first thing into the aid — start it before anything else. Probably a long sleeve to start the leg, and at least the winter layers go into Brooks’s pack for later.", "This is the longest stop of the race, but try to keep it to about 12 minutes. Watch the clock and get me out."], carry: [{ n: 1, item: "g50caf" }, { n: 1, item: "g40" }, { n: 1, item: "g24" }], bottles: [{ text: "Belt bottle, 675 ml — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Pack bottle 1, 500 ml — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Pack bottle 2, 500 ml — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Brooks adds whatever extra water he wants for himself" }], carbScoops: 3, packSwap: "Switch out of the pack and into the belt. Brooks takes the pack and mules it from here — 1,675 ml between the two of us. Offload anything else heavy onto him now.", food: "Calories, calories, calories. This is the stop that gets me back into life, so get as much in me as I'll take." },
  { mile: "72.8", dropBag: true, name: "Half Pipe (in)", gps: [39.1609972, -106.3683254], crew: "no", pacer: "Brooks", leg: { d: 2.3, up: 65, dn: 212 }, cutoff: "2:00 AM Sun", stop: "3m", target: "10:44p", safe: "12:25a Su", carry: [{ n: 1, item: "g24" }, { n: 1, item: "g50caf" }], bottles: [{ text: "Refill the belt and both pack bottles with aid-station water" }] },
  { mile: "75.1", name: "Pipeline (in)", gps: [39.189052, -106.374687], crew: "no", pacer: "Brooks", leg: { d: 3.6, up: 83, dn: 192 }, target: "11:12p", safe: "12:57a Su", note: ["NOT STOPPING HERE. Running straight through from Half Pipe to Outward Bound — 5.9 mi in one go. Crew does not need to come to this one.", "It is a legal crew point if the plan changes (handoffs only, no aid, and no pacer-bib pickup — a pacer swapping in must already have the bib), which is why it stays on the list."] },
  { mile: "78.7", dropBag: true, name: "Outward Bound (in)", gps: [39.222625, -106.369214], crew: "yes", pacer: "Brooks", leg: { d: 5.5, up: 540, dn: 164 }, cutoff: "3:45 AM Sun", stop: "5m", target: "11:54p", safe: "1:43a Su", note: ["Last full crew stop — the last crew location on the course and the last stop with parking. Everything after this is 21.2 mi with one aid station and no driving access, so this is the crew's final chance to hand over anything heavy.", "Sadie crews here for both me and Brooks. Anything I need out of the car happens now, and anything I want at the Dam gets named here so she can bring it over.", "From here it's 5.5 mi to the Dam, which should be plenty of time for Sadie to take the shuttle across and be waiting there to swap in for Brooks."], carry: [{ n: 1, item: "g50caf" }], bottles: [{ text: "Belt bottle, 675 ml — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Pack bottle 1, 500 ml — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Pack bottle 2, 500 ml — 30 g high-carb scoop + 500 mg electrolyte scoop" }, { text: "Sadie's pack, bottle 1 — 500 ml, DOUBLE high-carb (2 × 30 g) + 500 mg electrolyte — the finish leg is the thinnest carry of the race" }, { text: "Sadie's pack, bottle 2 — 500 ml, mixed here and carried over on the shuttle" }], carbScoops: 6, lyteScoops: 5, packSwap: "Last scoops of the race. The two bottles for the finish leg get mixed HERE and go over the shuttle in Sadie's pack — there is no powder at the Dam." },
  { mile: "84.2", dropBag: true, name: "Turquoise Lake Dam (in)", gps: [39.25274, -106.36612], crew: "no", pacer: "Sadie", pacerStart: true, leg: { d: 15.7, up: 1849, dn: 1615 }, cutoff: "5:30 AM Sun", stop: "3m", target: "1:07a Su", safe: "3:02a Su", note: ["Sadie swaps in here via the shuttle from Outward Bound. Brooks takes the shuttle back.", "Possible sock and shirt change here, TBD."], carry: [{ n: 1, item: "g50caf" }, { n: 1, item: "g24" }, { n: 1, item: "g24caf", how: "take it about two hours in, not at the stop" }], bottles: [{ text: "My pack, bottle 1 — 500 ml, half the 90 g Tailwind pack from the bag", uses: [{ n: 1, item: "tw90" }] }, { text: "My pack, bottle 2 — 500 ml, the other half of the Tailwind pack" }, { text: "Sadie's pack, bottle 1 — 500 ml, already mixed at Outward Bound" }, { text: "Sadie's pack, bottle 2 — 500 ml, already mixed at Outward Bound" }, { text: "Top everything off with aid-station water — this is the last water on the course" }], packSwap: "Take my pack back off Brooks and drop the belt. Sadie carries the second pack. 4 × 500 ml between us, and no refill for 15.7 mi." },
  { mile: "99.9", name: "Finish — 6th & Harrison", crew: "yes", pacer: "—", cutoff: "10:00 AM Sun", target: "4:45a Su", safe: "7:00a Su", note: ["Brooks can join for the final mile down 6th Ave.", "Beer + pizza + shower + sleep."], gear: [{ label: "Have at the finish", items: ["Blanket", "Patagonia jacket", "Beer", "Crocs"] }] },
];

// ── The five drop bags ───────────────────────────────────────────────────────
// Four of the five locations are hit twice, so a single bag has to cover both
// visits. Splitting each bag by visit is the whole point — the outbound half
// must not eat the inbound half.
type Visit = {
  label: string;
  mile: string;
  items: Load[];
  tag: string; // what to write on the inner ziploc
  warn?: string;
};
type Bag = {
  place: string;
  kind: "drop" | "crew"; // race drop bag, or a bag crew carries in themselves
  visits: Visit[];
  tag: string; // what to write on the outside of the bag
  extras?: string[];
  note?: string;
};

const bags: Bag[] = [
  {
    place: "Turquoise Lake Dam",
    kind: "drop",
    tag: "DAM — Ham Evans #___",
    visits: [
      {
        label: "Outbound", mile: "20.5", tag: "DAM — OUT — mile 20.5",
        items: [{ n: 1, item: "g40" }, { n: 1, item: "g24" }],
      },
      {
        label: "Inbound", mile: "84.2", tag: "DAM — IN — mile 84.2 — DO NOT OPEN OUTBOUND",
        items: [{ n: 1, item: "g50caf" }, { n: 1, item: "g24" }, { n: 1, item: "g24caf" }, { n: 1, item: "tw90" }],
        warn: "Do not touch this half on the way out.",
      },
    ],
    extras: ["Spare headlamp batteries", "Dry socks", "Long-sleeve for the last leg"],
    note: "The most important bag in the race. Its inbound half feeds the last 15.7 mi with no aid, no crew and no water after it. Pack the two halves in separate labelled ziplocs.",
  },
  {
    place: "Half Pipe",
    kind: "drop",
    tag: "HALF PIPE — Ham Evans #___",
    visits: [
      {
        label: "Outbound", mile: "31.8", tag: "HALF PIPE — OUT — mile 31.8",
        items: [{ n: 2, item: "g50na" }, { n: 1, item: "tw90" }],
      },
      {
        label: "Inbound", mile: "72.8", tag: "HALF PIPE — IN — mile 72.8",
        items: [{ n: 1, item: "g24" }, { n: 1, item: "g50caf" }],
      },
    ],
    note: "No crew either time, and inbound it is the last bag before Outward Bound — we run straight past Pipeline. The outbound visit takes the sodium gels and the Tailwind pack.",
  },
  {
    place: "Twin Lakes",
    kind: "crew",
    tag: "TWIN LAKES — CREW SHUTTLE BAG",
    visits: [
      {
        label: "Outbound", mile: "40.5", tag: "TWIN LAKES — OUT — mile 40.5",
        items: [
          { n: 2, item: "g50na" }, { n: 2, item: "g40na" },
          { n: 1, item: "g50caf" }, { n: 1, item: "g24caf" }, { n: 1, item: "tw90" },
        ],
      },
      {
        label: "Inbound", mile: "64.2", tag: "TWIN LAKES — IN — mile 64.2 — NIGHT",
        items: [{ n: 1, item: "g50caf" }, { n: 1, item: "g40" }, { n: 1, item: "g24" }],
      },
    ],
    extras: ["Socks", "Shirt", "Warm layers for the night half"],
    note: "Not a race drop bag — crew carries this in on the shuttle, and can only bring what fits in their lap. Pack it to that limit. The outbound half feeds the Hope crossing; the inbound half starts the night.",
  },
  {
    place: "Winfield",
    kind: "drop",
    tag: "WINFIELD — Ham Evans #___",
    visits: [
      {
        label: "Once only", mile: "52.3", tag: "WINFIELD — mile 52.3 — ALL OF IT",
        items: [
          { n: 2, item: "g50na" }, { n: 1, item: "g40na" }, { n: 1, item: "g24" },
          { n: 1, item: "g50caf" }, { n: 1, item: "g24caf" }, { n: 2, item: "tw90" },
        ],
      },
    ],
    note: "No crew, no pacer, and four and a half hours back over Hope on whatever comes out of this bag. Two Tailwind packs: one mixed at Winfield, one carried dry for the top of Hope. Pack it like the aid station won't have anything.",
  },
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


// Spelled out, one line per thing, so nothing has to be decoded at mile 78.
function LoadList({ loads }: { loads: Load[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-fg/80">
      {loads.map((l) => (
        <li key={l.item + l.how}>
          {l.n} &times; {ITEMS[l.item].name}
          {l.how && <span className="text-fg/60"> &mdash; {l.how}</span>}
        </li>
      ))}
    </ul>
  );
}

// Section label inside a stop — "Crew notes", "Gear", "Fuel".
function Heading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 text-xs font-bold uppercase tracking-widest text-fg">
      {children}
    </p>
  );
}

// Quiet label above a list — Carry, In bottles, Food, Pack, and the gear lists.
// Deliberately not bold: the only bold in a stop is its heading and its data line.
function SubHeading({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-fg/50">{children}</p>;
}

function Gain({ up, dn }: { up: number; dn: number }) {
  return (
    <>
      <span className="text-emerald-700">&uarr;{up.toLocaleString("en-US")}</span>{" "}
      <span className="text-red-700">&darr;{dn.toLocaleString("en-US")}</span>
    </>
  );
}

export default function CrewGuide() {
  const dropBags = bags.filter((b) => b.kind === "drop");
  const bagVisits = dropBags.reduce((n, b) => n + b.visits.length, 0);
  const twiceBags = dropBags.filter((b) => b.visits.length > 1).length;

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
          Leadville 100 — Crew &amp; Fueling Guide
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

                {/* tags */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {s.crew !== "n/a" && <Badge {...crewLabel[s.crew]} />}
                  {s.dropBag && (
                    <Badge text="Drop bag" cls="bg-violet-600/15 text-violet-800" />
                  )}
                  <Badge {...pacerBadge(s.pacer, s.pacerStart)} />
                </div>

                {/* distance + gain, then the clock */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-fg">
                  {legIn && (
                    <span className="whitespace-nowrap tabular-nums">
                      {legIn.d.toFixed(1)} mi in <Gain up={legIn.up} dn={legIn.dn} />
                    </span>
                  )}
                  {s.target && (
                    <span className="whitespace-nowrap tabular-nums">
                      target {s.target}
                    </span>
                  )}
                  {s.safe && (
                    <span className="whitespace-nowrap tabular-nums">
                      safe {s.safe}
                    </span>
                  )}
                  {s.cutoff && (
                    <span className="whitespace-nowrap tabular-nums">
                      cutoff {s.cutoff}
                    </span>
                  )}
                  {s.stop && (
                    <span className="whitespace-nowrap">
                      stop ~{s.stop.replace("m", " min")}
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

                {s.note && (
                  <>
                    <Heading>Crew notes</Heading>
                    <div className="mt-2 space-y-4 text-fg/80">
                      {(Array.isArray(s.note) ? s.note : [s.note]).map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </>
                )}

                {s.gear && (
                  <>
                    <Heading>Gear</Heading>
                    {s.gear.map((list) => (
                      <div key={list.label} className="mt-4">
                        <SubHeading>{list.label}</SubHeading>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-fg/80">
                          {list.items.map((g) => (
                            <li key={g}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                )}

                {(s.carry || s.bottles || s.food || s.packSwap) && (
                  <>
                    <Heading>Fuel</Heading>

                    {s.carry && (
                      <>
                        <SubHeading>Carry</SubHeading>
                        <LoadList loads={s.carry} />
                      </>
                    )}

                    {s.bottles && (
                      <>
                        <SubHeading>In bottles</SubHeading>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-fg/80">
                          {s.bottles.map((b) => (
                            <li key={b.text}>{b.text}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {s.food && (
                      <>
                        <SubHeading>Food</SubHeading>
                        <p className="mt-2 text-fg/80">{s.food}</p>
                      </>
                    )}

                    {s.packSwap && (
                      <>
                        <SubHeading>Pack</SubHeading>
                        <p className="mt-2 text-fg/80">{s.packSwap}</p>
                      </>
                    )}

                  </>
                )}
              </section>
            );
          })}
        </div>

        {/* Anything that isn't tied to a single stop */}
        <h2 className="mt-16 border-t border-fg/15 pt-16 text-xs font-bold uppercase tracking-widest text-fg/40 sm:mt-20 sm:pt-20">
          Other information
        </h2>
        <div className="mt-6 rounded-lg border border-fg/15 bg-fg/[0.02] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-fg/40">
            Fueling
          </p>
          <p className="mt-3 text-fg/80">
            Goal is <span className="font-bold text-fg">75&ndash;90 g of carbs</span>{" "}
            and <span className="font-bold text-fg">~500 mg of sodium</span> every
            hour.
          </p>
          <p className="mt-2 text-fg/80">
            Set a watch alarm for it. The plan is not &ldquo;eat when hungry&rdquo;
            &mdash; by mile 50 I will not be hungry and I will still need 75 g. Every
            stop above lists exactly what goes in my hands and what goes in the
            bottles.
          </p>
          <p className="mt-2 text-fg/80">
            <span className="font-bold text-fg">
              The scoops only exist where crew is
            </span>{" "}
            &mdash; the start, Pipeline out, both Outward Bounds and both Twin Lakes.
            Everywhere else is gels and Tailwind packs out of a bag, mixed with
            aid-station water.
          </p>
          <p className="mt-2 text-fg/80">
            <span className="font-bold text-fg">
              Three stops have nothing of mine.
            </span>{" "}
            Carter Summit and both Hope Pass crossings have water and food, no drop bag
            and no crew, so three Tailwind packs travel dry and get mixed there
            &mdash; the only way to make a carb bottle mid-carry.
          </p>

          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-fg/40">
            Caffeine
          </p>
          <p className="mt-3 text-fg/80">
            Nine caffeine gels &mdash; six at 100 mg and three small ones at 75 mg.
            A 100 mg gel goes out at every stop from Twin Lakes out to the end: Twin
            Lakes out, Winfield, Twin Lakes in, Half Pipe in, Outward Bound in, the
            Dam. The three 75 mg ones ride along on the only carries over four hours
            &mdash; Twin Lakes out, Winfield and the Dam &mdash; to be taken about two
            hours in, not at the stop.{" "}
            <span className="font-bold text-fg">
              Never two at once, and nothing caffeinated before Twin Lakes out.
            </span>{" "}
            The counts are exact; hand out a spare and a later stop goes without.
          </p>

          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-fg/40">
            When the stomach turns
          </p>
          <p className="mt-3 text-fg/80">
            Back off the concentration, not the calories. Slow down 10 minutes and keep
            sipping; drop to the 24 g gels and dilute the bottle; cold and salty beats
            sweet. If nothing goes down, keep taking fluid and get 35&ndash;40 g in any
            way possible &mdash; an hour at zero is survivable, two is a DNF.
          </p>

          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-fg/40">
            Real food
          </p>
          <p className="mt-3 text-fg/80">
            Gels alone won&rsquo;t hold up all day. Start adding real food around{" "}
            <a href="#stop-40-5" className="underline underline-offset-4 hover:text-fg">
              Twin Lakes out (mile 40.5)
            </a>{" "}
            and keep it going inbound. Aid-station food is fine for this &mdash;
            sandwiches, quesadillas, wraps, anything soft. Nothing super dry; it
            just needs to be calories that go down.
          </p>

          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-fg/40">
            Sock and shoe changes
          </p>
          <p className="mt-3 text-fg/80">
            Ideally I&rsquo;m not the one untying my shoes &mdash; get them untied
            and off me while I&rsquo;m sitting down. I&rsquo;ll retie them myself.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-fg/15 bg-fg/[0.02] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-fg/40">
            How to talk to me
          </p>
          <p className="mt-3 text-fg/80">
            <span className="font-bold text-fg">
              Probably skip &ldquo;how are you feeling?&rdquo;
            </span>{" "}
            Odds are the answer is &ldquo;not great,&rdquo; and if it&rsquo;s going
            well I&rsquo;ll say so.
          </p>
          <p className="mt-4 text-fg/80">
            <span className="font-bold text-fg">
              Handing me things beats asking what I need
            </span>{" "}
            &mdash; especially late. Gels, how many, fluid: if you can just run it
            without checking in, that&rsquo;s ideal. My brain will be pretty fried
            by then and every decision costs something. I&rsquo;ll speak up about
            clothes and anything else I want.
          </p>
          <p className="mt-4 text-fg/80">
            <span className="font-bold text-fg">A little tough love helps.</span>{" "}
            Being told to stop being a bitch and get moving works better on me
            than coddling. Encouragement is always welcome too &mdash; just keep it
            honest, no need to tell me I look great when I don&rsquo;t.
          </p>
          <p className="mt-4 text-fg/80">
            <span className="font-bold text-fg">No apologies this weekend.</span> If
            something gets forgotten, left in the car, packed in the wrong bag
            &mdash; we&rsquo;re problem solving instead of apologizing.
          </p>
        </div>

        {/* ── Drop bags ── */}
        <h2 className="mt-16 border-t border-fg/15 pt-16 text-xs font-bold uppercase tracking-widest text-fg/40 sm:mt-20 sm:pt-20">
          What&rsquo;s in each drop bag
        </h2>
        <p className="mt-4 text-fg/80">
          There are{" "}
          <span className="font-bold text-fg">
            {dropBags.length} race drop bags, not {bagVisits} stops
          </span>
          . {twiceBags} of the {dropBags.length} get hit twice &mdash; once outbound,
          once on the way home &mdash; so one bag covers both visits. Each bag below is
          split by visit, and the two halves should go in separate labelled ziplocs so
          the outbound stop can&rsquo;t eat the inbound one.
        </p>
        <p className="mt-4 text-fg/80">
          <span className="font-bold text-fg">
            Outward Bound and Twin Lakes get no drop bag.
          </span>{" "}
          Crew is at both with the car at Outward Bound and on the shuttle at Twin
          Lakes, so those are handed over, not dropped. The Twin Lakes list is still
          below, because crew can only carry what fits in their lap and needs to know
          exactly what that is.
        </p>

        <div className="mt-6 space-y-4">
          {bags.map((b) => (
            <div
              key={b.place}
              className="rounded-lg border border-fg/15 bg-fg/[0.02] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div>
                  <p className="text-lg font-bold tracking-tight text-fg">{b.place}</p>
                  <p className="mt-1 font-mono text-xs text-fg/50">
                    Write on the bag: <span className="text-fg/80">{b.tag}</span>
                  </p>
                </div>
                <span className="flex flex-wrap gap-1.5">
                  <Badge
                    {...(b.kind === "drop"
                      ? { text: "race drop bag", cls: "bg-violet-600/15 text-violet-800" }
                      : { text: "crew carries in", cls: "bg-sky-600/15 text-sky-800" })}
                  />
                  {b.visits.length > 1 && (
                    <Badge
                      text="one bag, two visits"
                      cls="bg-amber-500/20 font-bold text-amber-800"
                    />
                  )}
                </span>
              </div>

              {b.visits.map((v) => (
                <div key={v.label} className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-fg/40">
                    {v.label} &mdash; mile {v.mile}
                  </p>
                  <p className="mt-1 font-mono text-xs text-fg/50">
                    Ziploc: <span className="text-fg/80">{v.tag}</span>
                  </p>
                  <LoadList loads={v.items} />
                  {v.warn && (
                    <p className="mt-2 text-sm font-bold text-red-700">{v.warn}</p>
                  )}
                </div>
              ))}

              {b.extras && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-fg/40">
                    Also in the bag
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-fg/80">
                    {b.extras.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {b.note && <p className="mt-4 text-fg/70">{b.note}</p>}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
