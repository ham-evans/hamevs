import Link from "next/link";

export default function Mementos() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-3xl">
        <Link
          href="/grandave"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; grandave
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg text-center">
          Momentos
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/grandave/mementos/usaa-addresses-1956-1961"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Various Addresses 1956–1961 via USAA
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Clovis AFB to Boulder to Pasadena to La Canada — traced through insurance statements
            </p>
          </Link>
          <Link
            href="/grandave/selected-momentos"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Selected Momentos — 1961 On
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Receipts, documents, and keepsakes from the Evans family
            </p>
          </Link>
          <Link
            href="/grandave/mementos/momentos-1974"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Momentos — circa 1974
            </p>
            <p className="mt-1 text-sm text-fg/50">
              The King and I tickets, wish lists, car repair notes, to-do lists
            </p>
          </Link>
          <Link
            href="/grandave/mementos/momentos-1975"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Momentos — circa 1975
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Postcard from Paso Robles, UCLA football ticket, Datsun B210 shopping
            </p>
          </Link>
          <Link
            href="/grandave/clippings/first-computers"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              My First Computers — Atari 800 then 486
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Receipts and brochures — Atari 800 in 1982, NT 486 WinSeries in 1994
            </p>
          </Link>
          <Link
            href="/grandave/mementos/cu-centennial-1993"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              CU Engineering Centennial — Invited Speaker, 1993
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Symposium program, speaker bios, Dave&apos;s handwritten speech notes, &quot;Dedicated Behavior&quot; slides
            </p>
          </Link>
          <Link
            href="/grandave/clippings/fhs-hall-of-fame-1993"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              FHS Hall of Fame Induction — 1993
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Farmington High School Distinguished Achievement Hall of Fame — inaugural class
            </p>
          </Link>
          <Link
            href="/grandave/mementos/unm-50th-anniversary"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              UNM Class of 1953 — 50th Anniversary
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Reunion book entry and commencement questionnaire — vodka oranges, panty raids, boycotts
            </p>
          </Link>
          <Link
            href="/grandave/mementos/boys-with-skee"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Boys with Skee
            </p>
            <p className="mt-1 text-sm text-fg/50">
              The boys lined up in front of the house
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
