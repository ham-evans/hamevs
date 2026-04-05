import { getGrandaveEntry } from "@/lib/grandave";
import Link from "next/link";

export default async function AirCadetsKirtland1947() {
  const story = await getGrandaveEntry("air-cadets-kirtland-1947");

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <article className="w-full max-w-3xl">
        <Link
          href="/grandave/clippings"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; clippings
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg text-center">
          {story.title}
        </h1>
        <div
          className="prose mt-8 text-fg/80 prose-a:text-fg prose-a:underline prose-p:mb-6 prose-img:my-8 prose-img:max-h-[40rem] prose-img:w-auto prose-img:mx-auto prose-h2:text-xl prose-h2:font-bold prose-h2:text-fg prose-h2:mt-10 prose-h2:mb-4"
          dangerouslySetInnerHTML={{ __html: story.contentHtml }}
        />
      </article>
    </main>
  );
}
