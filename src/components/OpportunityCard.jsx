export default function OpportunityCard({
  contact,
  opportunity
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">
            {contact.fullName}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {contact.position}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {contact.company}
          </p>
        </div>

        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-200">
          {opportunity.score}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {opportunity.reasons.map((reason) => (
          <span
            key={reason}
            className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300"
          >
            {reason}
          </span>
        ))}
      </div>
    </div>
  );
}