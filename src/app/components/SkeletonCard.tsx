export function SkeletonCard() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {/* Image skeleton */}
      <div
        className="skeleton-shimmer rounded-sm"
        style={{ aspectRatio: '3/4', width: '100%' }}
      />
      {/* Text skeletons */}
      <div className="pt-3">
        <div className="skeleton-shimmer h-3 rounded w-1/3 mb-2" />
        <div className="skeleton-shimmer h-4 rounded w-3/4 mb-1" />
        <div className="skeleton-shimmer h-4 rounded w-1/2 mb-3" />
        <div className="skeleton-shimmer h-4 rounded w-1/4" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 9 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8"
      aria-label="Loading products"
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">Loading products, please wait...</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
