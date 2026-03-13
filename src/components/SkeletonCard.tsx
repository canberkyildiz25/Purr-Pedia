export default function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-52 bg-orange-100" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-orange-100 rounded-full w-32" />
          <div className="h-5 bg-orange-100 rounded-full w-12" />
        </div>
        <div className="h-4 bg-orange-100 rounded-full w-24" />
        <div className="space-y-1.5">
          <div className="h-3 bg-orange-100 rounded-full w-full" />
          <div className="h-3 bg-orange-100 rounded-full w-4/5" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 bg-orange-100 rounded-full w-16" />
          <div className="h-5 bg-orange-100 rounded-full w-20" />
          <div className="h-5 bg-orange-100 rounded-full w-14" />
        </div>
      </div>
    </div>
  )
}
