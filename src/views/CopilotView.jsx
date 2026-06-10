import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";

const QUICK_PROMPTS = [
  "show recruiters",
  "show mentors",
  "show founders",
  "show AI data contacts",
  "profile suggestions",
  "create 7 day plan"
];

export default function CopilotView({
  copilotQuery,
  setCopilotQuery,
  askCopilot,
  copilotHistory
}) {
  return (
    <section>
      <SectionTitle
        eyebrow="Copilot"
        title="Network Copilot"
        subtitle="Ask simple questions over your uploaded network data. This is a local rule-based copilot, not an external AI call."
      />

      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={copilotQuery}
            onChange={(event) => setCopilotQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                askCopilot();
              }
            }}
            placeholder="Ask: show recruiters, show mentors, show Google contacts, create 7 day plan..."
            className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <button
            onClick={() => askCopilot()}
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-400"
          >
            Ask
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => askCopilot(prompt)}
              className="rounded-full bg-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/20"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {copilotHistory.length ? (
          copilotHistory.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
            >
              <p className="text-sm font-semibold text-violet-200">
                You: {item.q}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-200">
                {item.answer || "No matching data found."}
              </p>
            </div>
          ))
        ) : (
          <EmptyState
            title="Ask your network anything"
            subtitle="The copilot can filter recruiters, mentors, founders, AI/Data contacts, company matches, profile suggestions, and a 7-day plan."
            icon="🤖"
          />
        )}
      </div>
    </section>
  );
}