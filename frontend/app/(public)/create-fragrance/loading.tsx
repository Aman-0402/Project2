export default function CreateFragranceLoading() {
  return (
    <div className="min-h-screen bg-brown flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="label-luxury text-gold/50 text-[10px]">Loading</p>
      </div>
    </div>
  )
}
