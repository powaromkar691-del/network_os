import { useMemo, useState } from "react";

import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import OpportunityCard from "../components/OpportunityCard";

import { calculateOpportunityScore } from "../services/opportunity/opportunityScore";

const GOALS = [
  "All",
  "Software Engineer",
  "AI Engineer",
  "Data Scientist",
  "Quant Developer",
  "Researcher",
  "Founder"
];

export default function OpportunityView({ connections }) {
  const [goal, setGoal] = useState("All");

  const opportunities = useMemo(() => {
    let filtered = [...connections];

    if (goal !== "All") {
      filtered = filtered.filter((contact) => {
        const text = (
          (contact.position || "") +
          " " +
          (contact.domain || "")
        ).toLowerCase();

        switch (goal) {
          case "Software Engineer":
            return (
              text.includes("software") ||
              text.includes("engineer") ||
              text.includes("developer")
            );

          case "AI Engineer":
            return (
              text.includes("ai") ||
              text.includes("ml") ||
              text.includes("machine learning")
            );

          case "Data Scientist":
            return (
              text.includes("data") ||
              text.includes("analytics")
            );

          case "Quant Developer":
            return (
              text.includes("quant") ||
              text.includes("finance")
            );

          case "Researcher":
            return (
              text.includes("research") ||
              text.includes("professor")
            );

          case "Founder":
            return (
              text.includes("founder") ||
              text.includes("startup")
            );

          default:
            return true;
        }
      });
    }

    return filtered
      .map((contact) => ({
        contact,
        opportunity: calculateOpportunityScore(
          contact,
          contact.priorityScore || 0,
          contact.priorityScore || 0
        )
      }))
      .sort(
        (a, b) =>
          b.opportunity.score -
          a.opportunity.score
      )
      .slice(0, 20);
  }, [connections, goal]);

  if (!connections.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Engine"
          title="Opportunity Engine"
          subtitle="Find strongest career opportunities hidden in your network."
        />

        <EmptyState
          title="No opportunities available"
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
        subtitle="Discover the highest-value people, mentors, and career opportunities."
      />

      <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
        <label className="mb-2 block text-sm text-slate-400">
          Career Goal Mode
        </label>

        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white"
        >
          {GOALS.map((item) => (
            <option key={item}>
              {item}
            </option>
          ))}
        </select>

        <p className="mt-3 text-sm text-slate-400">
          NetworkOS will prioritize opportunities relevant to your selected career path.
        </p>
      </div>

      <div className="mb-6 rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5">
        <h3 className="font-semibold text-white">
          Top Opportunities Found
        </h3>

        <p className="mt-2 text-sm text-slate-300">
          {opportunities.length} high-value contacts ranked by opportunity score.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map(
          ({ contact, opportunity }) => (
            <OpportunityCard
              key={contact.id}
              contact={contact}
              opportunity={opportunity}
            />
          )
        )}
      </div>
    </section>
  );
}