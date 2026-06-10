import { generateConnectionMessage } from "../lib/scoring";

export default function MessageDraft({ contact }) {
  const draft = generateConnectionMessage(contact);

  function copyDraft() {
    navigator.clipboard?.writeText(draft);
  }

  return (
    <div className="rounded-3xl border border-violet-300/20 bg-violet-500/10 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-white">
          Smart Draft
        </h3>

        <button
          onClick={copyDraft}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/20"
        >
          Copy
        </button>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-200">
        {draft}
      </p>

      <p className="mt-3 text-xs text-slate-500">
        Draft only. NetworkOS should not auto-send LinkedIn messages.
      </p>
    </div>
  );
}
