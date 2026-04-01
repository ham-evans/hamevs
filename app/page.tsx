export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Hamilton Evans
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">
          Welcome to my corner of the internet.
        </p>
        <a
          href="mailto:hello@hamiltonevans.com"
          className="mt-6 inline-block text-neutral-500 underline underline-offset-4 transition-colors hover:text-neutral-900"
        >
          say hello
        </a>
      </div>
    </main>
  );
}
