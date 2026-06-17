import { useMemo } from "react";

import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";

import {
  buildPersonScore
} from "../services/intelligence/personScore";

export default function OpportunityView({
  connections,
  mentorList
}) {
  const opportunities = useMemo(() => {
    return connections
      .map((person) => ({
        contact: person,
        intelligence:
          buildPersonScore(person)
      }))
      .sort(
        (a, b) =>
          b.intelligence.opportunity -
          a.intelligence.opportunity
      )
      .slice(0, 20);
  }, [connections]);

  if (!connections.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Engine"
          title="Opportunity Engine"
          subtitle="Discover the highest-value opportunities in your network."
        />

        <EmptyState
          title="No opportunities available"
          subtitle="Upload LinkedIn ZIP or load sample data."
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
        subtitle="Relationship intelligence powered by your actual network."
      />

      <div className="mb-6 rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5">
        <h3 className="font-semibold text-white">
          Top Opportunities
        </h3>

        <p className="mt-2 text-sm text-slate-300">
          {opportunities.length} high-value contacts ranked by intelligence score.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map(
          ({
            contact,
            intelligence
          }) => (
            <div
              key={contact.id}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
            >
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
                  {intelligence.opportunity}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-black/20 p-2">
                  <p className="text-slate-500">
                    Mentor
                  </p>

                  <p className="font-semibold text-white">
                    {intelligence.mentor}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-2">
                  <p className="text-slate-500">
                    Influence
                  </p>

                  <p className="font-semibold text-white">
                    {intelligence.influence}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-2">
                  <p className="text-slate-500">
                    Recruiter
                  </p>

                  <p className="font-semibold text-white">
                    {intelligence.recruiter}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-2">
                  <p className="text-slate-500">
                    Priority
                  </p>

                  <p className="font-semibold text-white">
                    {intelligence.priority}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Mentor Intelligence
        </h3>

        <div className="space-y-3">
          {mentorList
            ?.slice(0, 5)
            .map((mentor) => {
              const score =
                buildPersonScore(
                  mentor
                );

              return (
                <div
                  key={mentor.id}
                  className="rounded-2xl bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        {mentor.fullName}
                      </p>

                      <p className="text-sm text-slate-400">
                        {mentor.position}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      Mentor {score.mentor}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}