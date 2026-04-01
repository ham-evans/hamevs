import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md text-center flex flex-col items-center">
        <Image
          src="/logo.png"
          alt="Hamilton Evans"
          width={400}
          height={400}
          priority
        />
        <a
          href="mailto:hello@hamiltonevans.com"
          className="mt-6 inline-block text-fg/50 underline underline-offset-4 transition-colors hover:text-fg"
        >
          say hello
        </a>
      </div>
    </main>
  );
}
