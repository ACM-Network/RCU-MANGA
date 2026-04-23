export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-72 animate-pulse rounded-[32px] bg-white/5" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-3">
            <div className="aspect-[3/4] animate-pulse rounded-[22px] bg-white/5" />
            <div className="space-y-3 p-3">
              <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-full animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
