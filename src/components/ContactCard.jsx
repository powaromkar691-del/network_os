export default function ContactCard({ contact }) {
  if (!contact) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">
            {contact.fullName}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {contact.position || contact.domain}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {contact.company || "No company"}
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          {contact.priorityScore}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] text-violet-200">
          {contact.domain}
        </span>

        <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-200">
          {contact.seniority}
        </span>
      </div>
    </div>
  );
}