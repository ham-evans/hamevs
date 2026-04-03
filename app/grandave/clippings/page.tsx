import Link from "next/link";

export default function Clippings() {
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
          Newspaper Clippings
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/grandave/clippings/air-cadets-kirtland-1947"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Farmington Air Cadets at Kirtland Field
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Farmington, September 12, 1947
            </p>
          </Link>
          <Link
            href="/grandave/clippings/graces-scrapbook"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Clippings from Grace&apos;s Scrapbook
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Who&apos;s Who in American Universities, ROTC rank ceremony, CU summer session
            </p>
          </Link>
          <Link
            href="/grandave/rotc-colonel"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Don Evans Is ROTC Colonel
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Farmington Daily Times, September 8, 1952
            </p>
          </Link>
          <Link
            href="/grandave/clippings/boulder-airport-expands"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Boulder Airport Expands Services
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Boulder, CO — circa 1957 — Dave Evans listed as flight instructor at Lazy 8 Aviation
            </p>
          </Link>
          <Link
            href="/grandave/clippings/grace-selby-obituary-1979"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Grace Evans Selby — Obituary
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Farmington Daily Sun, January 14, 1979 — Grandave&apos;s mother
            </p>
          </Link>
          <Link
            href="/grandave/clippings/evans-retires-jpl-1994"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Evans Retires After 36-Year JPL Career
            </p>
            <p className="mt-1 text-sm text-fg/50">
              La Cañada Valley Sun, June 1994 — titanium plaque from Chief Engineer John Casani
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
