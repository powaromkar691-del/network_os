export default function OpportunitySnapshot({
  contact
}) {
  if (!contact) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <p className="mb-2 text-xs uppercase tracking-wider text-violet-300">
        Best Opportunity
      </p>

      <h3 className="text-xl font-semibold text-white">
        {contact.fullName}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {contact.position}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {contact.company}
      </p>

      <div className="mt-4 flex gap-2">
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          Score {contact.priorityScore}
        </span>

        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
          {contact.domain}
        </span>
      </div>
    </div>
  );
}