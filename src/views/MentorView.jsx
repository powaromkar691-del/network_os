import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ContactCard from "../components/ContactCard";
import MessageDraft from "../components/MessageDraft";

import {
  buildPersonScore
} from "../services/intelligence/personScore";

export default function MentorView({
  mentorList
}) {
  if (!mentorList.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Intelligence"
          title="Mentor Intelligence"
          subtitle="Identify the strongest mentors in your network."
        />

        <EmptyState
          title="No mentor candidates yet"
          subtitle="Upload LinkedIn ZIP or load the sample demo."
          icon="🎯"
        />
      </section>
    );
  }

  const rankedMentors =
    [...mentorList]
      .map((mentor) => ({
        contact: mentor,
        intelligence:
          buildPersonScore(
            mentor
          )
      }))
      .sort(
        (a, b) =>
          b.intelligence.mentor -
          a.intelligence.mentor
      );

  return (
    <section>
      <SectionTitle
        eyebrow="Intelligence"
        title="Mentor Intelligence"
        subtitle="Discover the highest-value mentors hidden in your network."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rankedMentors
          .slice(0, 18)
          .map(
            ({
              contact,
              intelligence
            }) => (
              <div
                key={contact.id}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
              >
                <ContactCard
                  contact={contact}
                />

                <div className="mt-4 grid grid-cols-2 gap-2">
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

                <div className="mt-4 rounded-2xl bg-violet-500/10 p-4">
                  <p className="text-xs text-violet-300">
                    Recommended Approach
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    Ask a focused question
                    about their career path,
                    decision making, or
                    technical growth. Avoid
                    requesting referrals
                    immediately.
                  </p>
                </div>

                <div className="mt-4">
                  <MessageDraft
                    contact={contact}
                  />
                </div>
              </div>
            )
          )}
      </div>
    </section>
  );
}

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
        {value}
      </p>
    </div>
  );
}