import Link from "next/link";

export default function Stories() {
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
          Stories That Grandave Likes
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/grandave/stories/sr71-blackbird"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              SR-71 Blackbird
            </p>
            <p className="mt-1 text-sm text-fg/50">
              A first-person account of flying the world&apos;s fastest jet
            </p>
          </Link>
          <Link
            href="/grandave/stories/cavea-b-john-clark"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Cavea-B: John Clark&apos;s Work
            </p>
            <p className="mt-1 text-sm text-fg/50">
              The high-energy monopropellant that almost made it
            </p>
          </Link>
          <Link
            href="/grandave/stories/flying-truths"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              Flying Truths
            </p>
            <p className="mt-1 text-sm text-fg/50">
              A collection of aviation truisms and humor
            </p>
          </Link>
          <Link
            href="/grandave/stories/how-to-live-wisely"
            className="group block border-b border-fg/10 pb-4"
          >
            <p className="text-lg font-bold text-fg group-hover:underline">
              How to Live Wisely
            </p>
            <p className="mt-1 text-sm text-fg/50">
              A Harvard professor&apos;s five exercises for reflecting on what matters
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
