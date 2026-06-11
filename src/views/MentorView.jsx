import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ContactCard from "../components/ContactCard";
import MessageDraft from "../components/MessageDraft";
import { calculateMentorScore } from "../services/mentor/mentorScore";
export default function MentorView({ mentorList }) {
  if (!mentorList.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Radar"
          title="Mentor Radar"
          subtitle="Find senior, academic, founder, and high-value contacts worth learning from."
        />

        <EmptyState
          title="No mentor candidates yet"
          subtitle="Upload your LinkedIn ZIP or load the sample demo."
          icon="🎯"
        />
      </section>
    );
  }

  return (
    <section>
      <SectionTitle
        eyebrow="Radar"
        title="Mentor Radar"
        subtitle="Find senior, academic, founder, and high-value contacts worth learning from."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mentorList.slice(0, 18).map((contact) => {
          const mentor = calculateMentorScore(contact);
          return (
            <div
              key={contact.id}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
            >
              <ContactCard contact={contact} />
              <div className="mt-4 rounded-2xl bg-violet-500/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-violet-200">Mentor Score</span>
                   <span className="font-semibold text-white">{mentor.score}</span>
                 
                </div>
                 <div className="mt-2 flex flex-wrap gap-2">
                    {mentor.reasons.map((reason, index) => (
                      <span
                        key={reason}
                        className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-slate-300"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Ask angle: one specific roadmap question based on their role.
              Avoid asking for referral first.
            </p>

            <div className="mt-4">
              <MessageDraft contact={contact} />
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}