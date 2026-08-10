import RelationshipBadge from "./RelationshipBadge";

export default function ContactCard({
  contact,
  relationship
}) {
  if (!contact) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/[0.04]">
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">
            {contact.fullName || "Unknown Contact"}
          </h3>

          <p className="mt-1 truncate text-xs text-slate-400">
            {contact.position ||
              contact.domain ||
              "Unknown role"}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {contact.company || "No company"}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          {contact.priorityScore ?? 0}
        </span>
      </div>

      {/* Relationship */}

      {relationship ? (
        <div className="mt-3">
          <RelationshipBadge
            relationship={relationship}
          />
        </div>
      ) : null}

      {/* Classification */}

      <div className="mt-3 flex flex-wrap gap-2">
        {contact.domain ? (
          <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] text-violet-200">
            {contact.domain}
          </span>
        ) : null}

        {contact.seniority ? (
          <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-200">
            {contact.seniority}
          </span>
        ) : null}
      </div>

      {/* Additional metadata */}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <InfoItem
          label="Company"
          value={contact.company || "Unknown"}
        />

        <InfoItem
          label="Domain"
          value={contact.domain || "Unknown"}
        />
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-2">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-xs text-slate-300">
        {value}
      </p>
    </div>
  );
}