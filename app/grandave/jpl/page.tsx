import Link from "next/link";

export default function JPL() {
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
          Jet Propulsion Laboratory (JPL)
        </h1>
        <p className="mt-2 text-sm text-fg/50 text-center">
          1958–1994
        </p>
        <div className="mt-8 flex flex-col gap-4">
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
        </div>
      </div>
    </main>
  );
}
