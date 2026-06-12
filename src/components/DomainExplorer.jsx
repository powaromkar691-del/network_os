export default function DomainExplorer({
  domain,
  connections,
  onClose
}) {
  if (!domain) return null;

  const people = connections.filter(
    (person) => person.domain === domain
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="max-h-[85vh] w-full max-w-5xl overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {domain}
            </h2>

            <p className="text-slate-400">
              {people.length} connections
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="grid gap-3">
          {people.map((person) => (
            <div
              key={person.id}
              className="rounded-2xl border border-white/10 p-4"
            >
              <h3 className="font-semibold text-white">
                {person.fullName}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {person.position || "No Position"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {person.company || "No Company"}
              </p>

              <div className="mt-3 flex gap-2">
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                  {person.domain}
                </span>

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                  {person.seniority}
                </span>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  Score {person.priorityScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}