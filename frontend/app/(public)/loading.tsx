export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        <div className="w-8 h-px bg-gold/30" />
      </div>
    </div>
  )
}
