import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="flex w-full max-w-lg flex-1 flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-fg">
          Hamilton Evans
        </h1>

        <section className="mt-8">
          <ul className="list-disc space-y-2 pl-5 text-fg">
            <li>From South Pasadena, CA, currently living in New York, NY.</li>
            <li>
              Studied chemistry and CS at Middlebury, where I also played
              baseball.
            </li>
            <li>
              Started a chemistry PhD at Caltech in Scott Cushing&apos;s lab,
              left with a Masters after two years.
            </li>
            <li>
              Founded{" "}
              <a
                href="https://atomgrants.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-fg/70"
              >
                Atom Grants
              </a>
              , where we help research development teams support their
              researchers with grant applications.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-wide text-fg/50">Running</h2>
          <ul className="mt-3 space-y-2 text-fg">
            <li>
              6 Marathons &mdash; PR{" "}
              <a
                href="/running/cim-2025"
                className="underline underline-offset-4 hover:text-fg/70"
              >
                2:59:35
              </a>
            </li>
            <li>
              10 Ultramarathons &mdash; Including{" "}
              <a
                href="/running/leadville-100-2026"
                className="underline underline-offset-4 hover:text-fg/70"
              >
                Leadville 100
              </a>
              ,{" "}
              <a
                href="/running/run-rabbit-run-100-2024"
                className="underline underline-offset-4 hover:text-fg/70"
              >
                Run Rabbit Run 100
              </a>
              , and{" "}
              <a
                href="/running/canyons-100k-2026"
                className="underline underline-offset-4 hover:text-fg/70"
              >
                Canyons 100k
              </a>
            </li>
          </ul>
        </section>

        <section className="mt-auto flex flex-wrap justify-center gap-x-5 gap-y-2 pt-16 text-sm text-fg/50">
          <Link
            href="/running/leadville-100-2026/afterthoughts"
            className="underline underline-offset-4 hover:text-fg"
          >
            afterthoughts
          </Link>
          <a
            href="https://www.strava.com/athletes/44547906"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-fg"
          >
            strava
          </a>
          <a
            href="https://github.com/ham-evans"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-fg"
          >
            github
          </a>
          <a
            href="mailto:ham@atomgrants.com"
            className="underline underline-offset-4 hover:text-fg"
          >
            email
          </a>
          <a
            href="https://www.linkedin.com/in/hamevans/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-fg"
          >
            linkedin
          </a>
        </section>
      </div>
    </main>
  );
}
