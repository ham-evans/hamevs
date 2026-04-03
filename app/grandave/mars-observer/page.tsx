import Link from "next/link";

export default function MarsObserver() {
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
          Mars Observer
        </h1>
        <h2 className="mt-8 text-lg font-bold text-fg">
          Launch of Mars Observer
        </h2>
        <div className="mt-4 aspect-video w-full">
          <iframe
            className="h-full w-full rounded"
            src="https://www.youtube.com/embed/-ajKbUYJVh8"
            title="Mars Observer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <h2 className="mt-12 text-lg font-bold text-fg">
          NASA News Briefing
        </h2>
        <p className="mt-1 text-sm text-fg/50">August 19, 1992</p>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html: `<div style="position:relative;overflow:hidden;padding-bottom:56.25%"><iframe src="https://cdn.jwplayer.com/players/19xGhGOY-xS4RtpB7.html" width="100%" height="100%" frameborder="0" scrolling="auto" title="NASA%20News%20Briefing%20%7C%20C-SPAN.org" style="position:absolute;" allowfullscreen></iframe></div>`,
          }}
        />
        <p className="mt-4 text-sm text-fg/80">
          NASA officials briefed reporters on the upcoming Mars mission expected
          to be launched September 16 of this year. NASA officials said the
          spacecraft will be attached to a rocket and will enter the Mars orbit
          after an 11 month cruise. Scientists plan to use seven instruments to
          make a comprehensive and detailed study of the planet&apos;s atmosphere,
          surface, and interior. Their observations are planned to last a full
          martian year, or 687 earth days.
        </p>
      </article>
    </main>
  );
}
