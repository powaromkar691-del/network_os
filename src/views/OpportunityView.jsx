import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";

const OPPORTUNITY_BUCKETS = [
  [
    "Internship Guidance",
    "Recruiter / HR",
    "Ask what makes a FY/SY profile stand out."
  ],
  [
    "SDE Preparation",
    "Software Engineering",
    "Ask one specific DSA/project roadmap question."
  ],
  [
    "AI/Data Learning",
    "AI / ML",
    "Ask what beginner project gives strongest proof."
  ],
  [
    "Research Guidance",
    "Academia / Research",
    "Ask how to start reading papers or write a mini-review."
  ],
  [
    "Startup Learning",
    "Founder / Startup",
    "Ask what problem discovery skill to build early."
  ],
  [
    "Finance/Quant",
    "Finance / Quant",
    "Ask whether to start with Python, stats, DSA, or markets."
  ]
];

export default function OpportunityView({ connections }) {
  if (!connections.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Engine"
          title="Opportunity Engine"
          subtitle="Find strongest career opportunities hidden in your network."
        />

        <EmptyState
          title="No opportunity map yet"
          subtitle="Upload LinkedIn ZIP or load the sample demo."
          icon="🚀"
        />
      </section>
    );
  }

  return (
    <section>
      <SectionTitle
        eyebrow="Engine"
        title="Opportunity Engine"
        subtitle="Find strongest career opportunities hidden in your network."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {OPPORTUNITY_BUCKETS.map(([title, domain, action]) => {
          const list = connections
            .filter((connection) => connection.domain === domain)
            .sort((a, b) => b.priorityScore - a.priorityScore);

          return (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">
                    {title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {domain}
                  </p>
                </div>

                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
                  {list.length}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {action}
              </p>

              <div className="mt-4 space-y-2">
                {list.slice(0, 3).map((connection) => (
                  <p
                    key={connection.id}
                    className="truncate rounded-xl bg-black/20 px-3 py-2 text-xs text-slate-300"
                  >
                    {connection.fullName} —{" "}
                    {connection.company || connection.position}
                  </p>
                ))}

                {!list.length ? (
                  <p className="rounded-xl bg-black/20 px-3 py-2 text-xs text-slate-500">
                    No matching contacts found.
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}