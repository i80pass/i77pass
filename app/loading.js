// Skeleton loading UI for the root segment, the i80pass master's
// pattern: hero, webcam grid, and road condition cards in
// animate-pulse blocks.
export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16" aria-label="Loading">
      <div className="pt-6">
        <div className="h-10 w-3/4 rounded-xl bg-surface-container animate-pulse" />
        <div className="h-28 rounded-2xl bg-surface-container animate-pulse mt-4" />
        <div className="h-5 w-1/2 rounded bg-surface-container animate-pulse mt-5" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-outline-variant/40 bg-white">
            <div className="aspect-[4/3] bg-surface-container animate-pulse" />
            <div className="p-3.5">
              <div className="h-4 w-2/3 rounded bg-surface-container animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-surface-container animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 mt-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-surface-container animate-pulse" />
        ))}
      </div>
    </main>
  );
}
