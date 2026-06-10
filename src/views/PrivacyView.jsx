import SectionTitle from "../components/SectionTitle";

export default function PrivacyView() {
  return (
    <section>
      <SectionTitle
        eyebrow="Trust"
        title="Privacy & Safety Center"
        subtitle="NetworkOS analyzes uploaded export files, not live LinkedIn."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
          <div className="mb-4 text-3xl">
            🛡️
          </div>

          <h3 className="text-xl font-semibold text-white">
            Safe Product Boundary
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            The app extracts and analyzes the uploaded ZIP locally. It does not
            scrape LinkedIn, auto-view profiles, auto-connect, or auto-send
            messages.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-6">
          <div className="mb-4 text-3xl">
            ⚠️
          </div>

          <h3 className="text-xl font-semibold text-white">
            Sensitive Data Warning
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            LinkedIn exports may include messages, emails, phone numbers, and
            profile data. Sensitive fields should remain hidden by default.
          </p>
        </div>
      </div>
    </section>
  );
}