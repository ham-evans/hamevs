import Link from "next/link";

export default function GrandAve() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-fg text-center">
          Grandave
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/grandave/foreword-hamilton"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Foreword
            </p>
            <p className="mt-1 text-sm text-fg/50">
              By Hamilton Evans
            </p>
          </Link>
          <Link
            href="/grandave/my-life"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              My Life
            </p>
            <p className="mt-1 text-sm text-fg/50">
              A short synoptic biography by David Donald Evans
            </p>
          </Link>
          <Link
            href="/grandave/my-life-supplemental-matl"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              My Life Supplemental Matl
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Photos and supplemental materials
            </p>
          </Link>
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
        </div>
      </div>
    </main>
  );
}
