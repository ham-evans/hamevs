import { getAllMemories, getMemory } from "@/lib/memories";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllMemories().map((memory) => ({ slug: memory.slug }));
}

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const memory = await getMemory(slug);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <article className="w-full max-w-2xl">
        <Link
          href="/memories"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          &larr; all memories
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-fg text-center">
          {memory.title}
        </h1>
        <p className="mt-2 text-sm text-fg/50 text-center">{memory.date}</p>
        <div
          className="prose mt-8 text-fg/80 prose-a:text-fg prose-a:underline prose-p:mb-6 prose-img:my-8 prose-img:max-h-[40rem] prose-img:w-auto prose-img:mx-auto prose-img:rounded prose-h2:text-xl prose-h2:font-bold prose-h2:text-fg prose-h2:mt-10 prose-h2:mb-4"
          dangerouslySetInnerHTML={{ __html: memory.contentHtml }}
        />
      </article>
    </main>
  );
}
