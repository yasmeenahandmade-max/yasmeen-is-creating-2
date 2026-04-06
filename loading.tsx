export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-rose/20 border-t-brand-rose rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-brand-charcoal/30 tracking-wider uppercase">Loading...</p>
      </div>
    </div>
  );
}
