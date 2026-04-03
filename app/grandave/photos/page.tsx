import Link from "next/link";

export default function Photos() {
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
          Photos
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/grandave/photos/evans-myers"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Evans-Myers Family Photos
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Ancestors, Charles &amp; Grace, childhood, Air Force, and family life
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
        </div>
      </div>
    </main>
  );
}
