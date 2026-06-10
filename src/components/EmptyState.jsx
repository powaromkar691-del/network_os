export default function EmptyState({ title, subtitle, icon = "📦" }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <div className="mb-4 rounded-3xl bg-slate-800 p-4 text-3xl">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}