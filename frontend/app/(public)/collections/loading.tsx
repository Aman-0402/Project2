export default function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Header skeleton */}
      <div className="bg-brown py-24">
        <div className="container-luxury text-center">
          <div className="w-16 h-3 bg-ivory/10 rounded mx-auto mb-4" />
          <div className="w-40 h-10 bg-ivory/10 rounded mx-auto" />
        </div>
      </div>
      {/* Grid skeleton */}
      <div className="section-padding">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-beige mb-3" />
                <div className="h-4 bg-beige rounded w-3/4 mb-2" />
                <div className="h-3 bg-beige rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
