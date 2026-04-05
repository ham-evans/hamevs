import Link from "next/link";
import { getAllMemories } from "@/lib/memories";

export default function Memories() {
  const memories = getAllMemories();

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight text-fg">Memories</h1>
        <div className="mt-8 flex flex-col gap-6">
          {memories.map((memory) => (
            <div key={memory.slug} className="border-b border-fg/10 pb-4">
              <Link
                href={memory.href || `/memories/${memory.slug}`}
                className="group block"
              >
                <p className="text-lg font-bold text-fg group-hover:underline">
                  {memory.title}
                  {memory.status === "done" && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500 align-middle" />
                  )}
                </p>
                <p className="mt-1 text-sm text-fg/50">{memory.date}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
