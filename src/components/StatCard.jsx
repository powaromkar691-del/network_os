export default function StatCard({ title, value, icon, hint }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h3 className="mt-2 text-3xl font-semibold text-white">
            {value}
          </h3>

          {hint ? (
            <p className="mt-2 text-xs text-slate-500">{hint}</p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-violet-500/15 p-3 text-2xl text-violet-300">
          {icon}
        </div>
      </div>
    </div>
  );
}