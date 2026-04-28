import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex justify-center gap-6 px-6 pt-8 text-sm text-fg/50">
      <Link href="/" className="underline underline-offset-4 hover:text-fg">
        home
      </Link>
      <Link
        href="/running"
        className="underline underline-offset-4 hover:text-fg"
      >
        running
      </Link>
      <Link
        href="/gpx"
        className="underline underline-offset-4 hover:text-fg"
      >
        gpx
      </Link>
    </nav>
  );
}
