import { getRace } from "@/lib/races";
import Link from "next/link";

export default async function GrandAve() {
  const story = await getRace("grandave");

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <article className="w-full max-w-3xl">
        <Link
          href="/grandave"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; grandave
        </Link>
        <div className="text-center mb-12 mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-fg">
            {story.title}
          </h1>
          <p className="mt-2 text-sm text-fg/50 italic">
            A short synoptic biography
          </p>
          <p className="mt-1 text-sm text-fg/50">
            By David Donald Evans
          </p>
          <p className="mt-1 text-xs text-fg/30">
            Version 2b
          </p>
        </div>
        <div
          className="prose mt-8 text-fg/80 prose-a:text-fg prose-a:underline prose-p:mb-6 prose-img:my-8 prose-img:max-h-[40rem] prose-img:w-auto prose-img:mx-auto prose-h2:text-xl prose-h2:font-bold prose-h2:text-fg prose-h2:mt-10 prose-h2:mb-4"
          dangerouslySetInnerHTML={{ __html: story.contentHtml }}
        />
      </article>
    </main>
  );
}
