export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-5 animate-pulse ${className}`}>
      <div className="h-40 bg-white/5 rounded-xl mb-4" />
      <div className="h-4 bg-white/5 rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-white/5 rounded-full w-1/2 mb-4" />
      <div className="h-3 bg-white/5 rounded-full w-full mb-2" />
      <div className="h-3 bg-white/5 rounded-full w-5/6" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-white/5 rounded-full"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-24 h-24' }
  return <div className={`${sizes[size]} rounded-full bg-white/5 animate-pulse`} />
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 bg-white/5 rounded-xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-white/5 rounded-xl" />
      ))}
    </div>
  )
}

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'table') return <SkeletonTable rows={count} />
  if (type === 'text') return <SkeletonText lines={count} />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
