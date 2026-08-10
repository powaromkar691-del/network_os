const STATUS_CONFIG = {
  Healthy: {
    label: "Healthy",
    className:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
  },

  Warm: {
    label: "Warm",
    className:
      "border-amber-400/20 bg-amber-500/10 text-amber-300"
  },

  Dormant: {
    label: "Dormant",
    className:
      "border-slate-400/20 bg-slate-500/10 text-slate-300"
  }
};

export default function RelationshipBadge({
  relationship,
  showScore = true
}) {
  if (!relationship) {
    return null;
  }

  const config =
    STATUS_CONFIG[relationship.status] ||
    STATUS_CONFIG.Dormant;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden="true"
      />

      <span>
        {config.label}
      </span>

      {showScore &&
      typeof relationship.score === "number" ? (
        <span className="opacity-70">
          {relationship.score}
        </span>
      ) : null}
    </div>
  );
}