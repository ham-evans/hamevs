import Link from "next/link";

export default function GrandAve() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-fg text-center">
          Grandave
        </h1>
        <div className="mt-6 flex flex-col items-center">
          <img
            src="/races/grandave-hero.jpg"
            alt="Gram and Grandave, Scottsdale, AZ — August 2017"
            className="max-h-[28rem] w-auto rounded"
          />
          <p className="mt-2 text-sm text-fg/40">
            Gram and Grandave, Scottsdale, AZ — August 2017
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <Link
            href="/grandave/foreword-hamilton"
            className="text-lg font-bold text-fg underline underline-offset-4 hover:text-fg/70"
          >
            Foreword
          </Link>
          <p className="text-sm text-fg/50">By Hamilton Evans</p>
          <Link
            href="/grandave/my-life"
            className="text-lg font-bold text-fg underline underline-offset-4 hover:text-fg/70"
          >
            My Life
          </Link>
          <p className="text-sm text-fg/50">
            A short synoptic biography by David Donald Evans
          </p>
        </div>
        <hr className="my-8 border-fg/10" />
        <p className="text-xs text-fg/40 uppercase tracking-widest mb-4">
          Additional
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/grandave/p-38-farmington"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              The P-38 Lands in Farmington!
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Excitement for an aviation buff teenager
            </p>
          </Link>
          <Link
            href="/grandave/mooney-mite"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              My Mooney Mite Trip
            </p>
            <p className="mt-1 text-sm text-fg/50">
              A letter home about an extensive trip in a Mooney Mite airplane
            </p>
          </Link>
          <Link
            href="/grandave/clippings"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Newspaper Clippings
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Articles about Grandave from the papers
            </p>
          </Link>
          <Link
            href="/grandave/mementos"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Mementos
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Receipts, documents, awards, and keepsakes
            </p>
          </Link>
          <Link
            href="/grandave/air-force-career"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Air Force Career
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Summary of official file excerpts, ROTC through honorable discharge
            </p>
          </Link>
          <Link
            href="/grandave/mars-observer"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Mars Observer
            </p>
          </Link>
          <Link
            href="/grandave/voyager"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Voyager
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Emails and notes on the Voyager missions
            </p>
          </Link>
          <Link
            href="/grandave/letters"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Letters
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Written by Grandave
            </p>
          </Link>
          <Link
            href="/grandave/bedtime-stories"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              A Parent&apos;s Guide to Bedtime Stories
            </p>
            <p className="mt-1 text-sm text-fg/50">
              By Dave Evans — The story of Pupsie the Dog
            </p>
          </Link>
          <Link
            href="/grandave/stories"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Stories That Grandave Likes
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Interesting stories collected by Grandave
            </p>
          </Link>
          <Link
            href="/grandave/scanned-slides"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Scanned Slides
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Index to the David Evans family slide collection
            </p>
          </Link>
          <Link
            href="/grandave/nancy-lou-hayes"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Nancy Lou Hayes
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Growing up in Pasadena, family history, and memories by Nancy Hayes Evans
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
