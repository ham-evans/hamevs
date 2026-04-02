export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-fg">
          Hamilton Evans
        </h1>
        <div className="mt-6 flex flex-col gap-2 text-fg/50">
          <a
            href="mailto:ham@atomgrants.com"
            className="underline underline-offset-4 transition-colors hover:text-fg"
          >
            ham@atomgrants.com
          </a>
          <a
            href="tel:+16262982786"
            className="underline underline-offset-4 transition-colors hover:text-fg"
          >
            (626) 298-2786
          </a>
        </div>
      </div>
    </main>
  );
}
