import Link from "next/link";

const videos = [
  {
    id: "KOVn-cfFa_4",
    title: "Going Through the Trunk",
    description:
      "A start — Grandave and I going through his trunk together. There's not much here but worth including.",
  },
  {
    id: "TjKK2ZgfKuY",
    title: "Pins and Military Uniform Items",
    description:
      "Going through Grandave's old pins (from the Olympics and others) and military uniform items.",
  },
  {
    id: "4sN8T5QhmE4",
    title: "Becoming Mars Observer Project Manager",
    description: "JPL Stories — how Grandave became Mars Observer Project Manager.",
  },
  {
    id: "cZuNzIifbV4",
    title: "Early TV and Camera Prices",
    description: "A short conversation about early TV and camera prices.",
  },
  {
    id: "Op5ipW1ORNU",
    title: "Flat Tire Story",
    description: "A story of Grandave getting a flat tire.",
  },
  {
    id: "sFFli7xikHw",
    title: "JPL Stories and Papers",
    description:
      "Outlining some JPL stories, papers Grandave published, and more.",
  },
];

export default function Videos() {
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
          Recorded Conversations
        </h1>
        <p className="mt-2 text-sm text-fg/50 text-center">
          Some conversations I filmed with Grandave
        </p>
        <p className="mt-6 text-sm italic text-fg/60">
          Sometime, maybe in 2017 or 2018, I decided to film some conversations I had with Grandave — mostly him going through stories from JPL and the military. Again, I&apos;m not quite sure what inspired this but it is some footage I cherish very much. Please ignore my inexperienced interview style.
        </p>
        <hr className="my-8 border-fg/10" />
        <div className="flex flex-col gap-12">
          {videos.map((video) => (
            <div key={video.id} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-fg">{video.title}</h2>
              <p className="text-sm text-fg/60">{video.description}</p>
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
