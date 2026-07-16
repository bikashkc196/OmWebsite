export default function SkeletonCard({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded-2xl border border-line p-6
            animate-pulse shadow-sm"
        >
          {/* Top row */}
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-4 bg-surface2 rounded-full w-36" />
              <div className="h-3 bg-surface2 rounded-full w-24" />
            </div>
            <div className="h-6 bg-surface2 rounded-full w-20" />
          </div>
          {/* Mid content */}
          <div className="space-y-2 mb-5">
            <div className="h-3 bg-surface2 rounded-full w-full" />
            <div className="h-3 bg-surface2 rounded-full w-4/5" />
          </div>
          {/* Bottom row */}
          <div className="flex gap-3 pt-4 border-t border-line">
            <div className="h-9 bg-surface2 rounded-xl w-28" />
            <div className="h-9 bg-surface2 rounded-xl w-28" />
          </div>
        </div>
      ))}
    </>
  );
}
