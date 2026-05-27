export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-ivory animate-pulse">
      <div className="container-luxury pt-32 pb-6">
        <div className="flex gap-2">
          <div className="w-16 h-3 bg-beige rounded" />
          <div className="w-3 h-3 bg-beige rounded" />
          <div className="w-20 h-3 bg-beige rounded" />
          <div className="w-3 h-3 bg-beige rounded" />
          <div className="w-24 h-3 bg-beige rounded" />
        </div>
      </div>
      <div className="container-luxury pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[4/5] bg-beige" />
          <div className="flex flex-col justify-center gap-4 py-8">
            <div className="w-20 h-3 bg-beige rounded" />
            <div className="w-3/4 h-10 bg-beige rounded" />
            <div className="w-32 h-6 bg-beige rounded" />
            <div className="w-12 h-px bg-beige-dark" />
            <div className="space-y-2">
              <div className="h-3 bg-beige rounded" />
              <div className="h-3 bg-beige rounded w-5/6" />
              <div className="h-3 bg-beige rounded w-4/6" />
            </div>
            <div className="flex gap-3 mt-4">
              <div className="h-12 flex-1 bg-beige rounded" />
              <div className="h-12 flex-1 bg-beige rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
