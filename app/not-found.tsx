import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">This story node does not exist.</h1>
        <p className="mt-4 text-stone-300">
          The requested page is missing, hidden behind a sealed gate, or removed from the active timeline.
        </p>
        <Link
          href="/library"
          className="mt-6 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/5"
        >
          Return To Library
        </Link>
      </div>
    </div>
  );
}
