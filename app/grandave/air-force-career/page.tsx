import { getGrandaveEntry } from "@/lib/grandave";
import Link from "next/link";

export default async function AirForceCareer() {
  const story = await getGrandaveEntry("air-force-career");

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <article className="w-full max-w-3xl">
        <Link
          href="/grandave"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; grandave
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg text-center">
          {story.title}
        </h1>
        <div
          className="prose mt-8 text-fg/80 prose-a:text-fg prose-a:underline prose-p:mb-6 prose-img:my-8 prose-img:max-h-[40rem] prose-img:w-auto prose-img:mx-auto prose-h2:text-xl prose-h2:font-bold prose-h2:text-fg prose-h2:mt-10 prose-h2:mb-4"
          dangerouslySetInnerHTML={{ __html: story.contentHtml }}
        />
        <div className="mt-10 flex flex-col gap-4">
          <Link
            href="/grandave/air-force-career/personal-affairs"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Statement of Personal History — 1952
            </p>
            <p className="mt-1 text-sm text-fg/50">
              DD Form 398 — employment, education, residences, references
            </p>
          </Link>
          <Link
            href="/grandave/air-force-career/af-commissioning-1953"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              ROTC Distinguished Graduate &amp; Commissioning — 1953
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Distinguished Graduate letter, certificate, appointment as 2nd Lt
            </p>
          </Link>
          <Link
            href="/grandave/af-medical-1953"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Medical Exam for Flying — October 6, 1953
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Physical examination report for flight training
            </p>
          </Link>
          <Link
            href="/grandave/air-force-career/af-pilot-training-1953"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Active Duty &amp; Pilot Training — 1953–1954
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Called to active duty, Lackland processing, Spence Air Base primary training
            </p>
          </Link>
          <Link
            href="/grandave/air-force-career/af-jet-training-1954"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Jet Training at Laredo — 1954
            </p>
            <p className="mt-1 text-sm text-fg/50">
              AERO rating, class roster with scores, specialty assignments
            </p>
          </Link>
          <Link
            href="/grandave/air-force-career/af-lowry-armament-1955"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Armament Systems School — Lowry AFB, 1954–1955
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Promotion to 1st Lt, graduation with Jim Leeth, assignment to Clovis
            </p>
          </Link>
          <Link
            href="/grandave/air-force-career/af-clovis-474th-1955"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              474th Fighter-Bomber Group — Clovis AFB, 1955–1956
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Group Armament Systems Officer, AFQT scores, release from active duty
            </p>
          </Link>
          <Link
            href="/grandave/air-force-career/dd214"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              DD Form 214 — Discharge Report
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Official report of transfer or discharge, September 27, 1956
            </p>
          </Link>
          <Link
            href="/grandave/air-force-career/af-reserve-discharge"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Reserve Service &amp; Honorable Discharge — 1957–1962
            </p>
            <p className="mt-1 text-sm text-fg/50">
              Reserve assignments, promotion, and honorable discharge certificate
            </p>
          </Link>
        </div>
      </article>
    </main>
  );
}
