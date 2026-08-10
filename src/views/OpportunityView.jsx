import { useMemo } from "react";

import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import RelationshipBadge from "../components/RelationshipBadge";

import {
  buildPersonScore
} from "../services/intelligence/personScore";

import {
  calculateRelationshipHealth
} from "../services/intelligence/relationshipHealth";

export default function OpportunityView({
  connections,
  mentorList,
  conversations = []
}) {
  /*
   * --------------------------------------------------
   * OPPORTUNITY ENGINE
   * --------------------------------------------------
   *
   * Every person is scored using the shared
   * intelligence layer.
   *
   * Relationship health is calculated separately
   * using the actual conversation data.
   */
  const opportunities = useMemo(() => {
    return connections
      .map((person) => {
        const intelligence =
          buildPersonScore(person);

        const relationship =
          calculateRelationshipHealth(
            person,
            conversations
          );

        return {
          contact: person,
          intelligence,
          relationship
        };
      })
      .sort(
        (a, b) =>
          b.intelligence.opportunity -
          a.intelligence.opportunity
      )
      .slice(0, 20);
  }, [
    connections,
    conversations
  ]);

  /*
   * --------------------------------------------------
   * MENTOR INTELLIGENCE
   * --------------------------------------------------
   *
   * Mentor ranking continues to use the existing
   * person intelligence engine.
   *
   * Relationship health is now added on top of it.
   */
  const mentors = useMemo(() => {
    return (mentorList || [])
      .map((person) => {
        const intelligence =
          buildPersonScore(person);

        const relationship =
          calculateRelationshipHealth(
            person,
            conversations
          );

        return {
          contact: person,
          intelligence,
          relationship
        };
      })
      .sort(
        (a, b) =>
          b.intelligence.mentor -
          a.intelligence.mentor
      )
      .slice(0, 5);
  }, [
    mentorList,
    conversations
  ]);

  /*
   * --------------------------------------------------
   * EMPTY STATE
   * --------------------------------------------------
   */

  if (!connections.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Engine"
          title="Opportunity Engine"
          subtitle="Discover the highest-value people, mentors, and career opportunities in your network."
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
        subtitle="AI-ranked opportunities based on your actual network data."
      />

      {/* --------------------------------------------------
          OPPORTUNITY SUMMARY
      -------------------------------------------------- */}

      <div className="mb-6 rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h3 className="font-semibold text-white">
              Top Opportunities
            </h3>

            <p className="mt-2 text-sm text-slate-300">
              {opportunities.length} high-value contacts
              ranked by the NetworkOS intelligence engine.
            </p>
          </div>

          <div className="rounded-full bg-white/10 px-4 py-2 text-xs text-violet-200">
            Data-driven ranking
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          OPPORTUNITY CARDS
      -------------------------------------------------- */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map(
          ({
            contact,
            intelligence,
            relationship
          }) => (
            <div
              key={contact.id}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              {/* Header */}

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    {contact.fullName ||
                      "Unknown Contact"}
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-400">
                    {contact.position ||
                      contact.domain ||
                      "Unknown role"}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {contact.company ||
                      "No company"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-200">
                  {intelligence.opportunity}
                </span>
              </div>

              {/* Relationship */}

              <div className="mt-4">
                <RelationshipBadge
                  relationship={relationship}
                />
              </div>

              {/* Intelligence Metrics */}

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <Metric
                  label="Mentor"
                  value={
                    intelligence.mentor
                  }
                />

                <Metric
                  label="Influence"
                  value={
                    intelligence.influence
                  }
                />

                <Metric
                  label="Recruiter"
                  value={
                    intelligence.recruiter
                  }
                />

                <Metric
                  label="Priority"
                  value={
                    intelligence.priority
                  }
                />
              </div>

              {/* Network Information */}

              <div className="mt-4 flex flex-wrap gap-2">
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

              {/* Relationship Context */}

              <div className="mt-4 rounded-2xl bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  Relationship
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {relationship.interactionCount > 0
                    ? `${relationship.interactionCount} interaction${
                        relationship.interactionCount === 1
                          ? ""
                          : "s"
                      } detected`
                    : "No conversation history detected"}
                </p>

                {relationship.twoWayInteractions >
                0 ? (
                  <p className="mt-1 text-xs text-emerald-300">
                    {relationship.twoWayInteractions} two-way interaction
                    {relationship.twoWayInteractions === 1
                      ? ""
                      : "s"}
                  </p>
                ) : null}
              </div>
            </div>
          )
        )}
      </div>

      {/* --------------------------------------------------
          MENTOR INTELLIGENCE
      -------------------------------------------------- */}

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Mentor Intelligence
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Mentors ranked using the same person intelligence
              system as the Opportunity Engine.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            {mentors.length} ranked
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {mentors.map(
            ({
              contact,
              intelligence,
              relationship
            }) => (
              <div
                key={contact.id}
                className="rounded-2xl bg-black/20 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {contact.fullName}
                    </p>

                    <p className="mt-1 truncate text-sm text-slate-400">
                      {contact.position ||
                        contact.domain ||
                        "Unknown role"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {contact.company ||
                        "No company"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <RelationshipBadge
                      relationship={
                        relationship
                      }
                      showScore={false}
                    />

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      Mentor{" "}
                      {intelligence.mentor}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                  <Metric
                    label="Mentor"
                    value={
                      intelligence.mentor
                    }
                  />

                  <Metric
                    label="Influence"
                    value={
                      intelligence.influence
                    }
                  />

                  <Metric
                    label="Priority"
                    value={
                      intelligence.priority
                    }
                  />

                  <Metric
                    label="Opportunity"
                    value={
                      intelligence.opportunity
                    }
                  />
                </div>
              </div>
            )
          )}

          {!mentors.length ? (
            <div className="rounded-2xl bg-black/20 p-4 text-sm text-slate-500">
              No mentor candidates were identified
              from the current network.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/*
 * --------------------------------------------------
 * METRIC COMPONENT
 * --------------------------------------------------
 */

function Metric({
  label,
  value
}) {
  return (
    <div className="rounded-xl bg-black/20 p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-white">
        {value ?? 0}
      </p>
    </div>
  );
}