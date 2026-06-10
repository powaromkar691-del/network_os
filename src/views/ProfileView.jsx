import SectionTitle from "../components/SectionTitle";
import StatCard from "../components/StatCard";
import MiniList from "../components/MiniList";
import { getProfileName } from "../lib/normalize";

export default function ProfileView({
  profile,
  profileAudit,
  sections,
  ownName
}) {
  return (
    <section>
      <SectionTitle
        eyebrow="Audit"
        title="Profile Audit"
        subtitle="Real audit from Profile.csv, Skills.csv, Education.csv, Positions.csv, Certifications.csv, Company Follows and Rich Media."
      />

      <div className="grid gap-5 lg:grid-cols-4">
        <StatCard
          title="Profile Score"
          value={profileAudit.score}
          icon="✨"
        />

        <StatCard
          title="Skills"
          value={(sections.skills || []).length}
          icon="🧠"
        />

        <StatCard
          title="Certifications"
          value={(sections.certifications || []).length}
          icon="🏅"
        />

        <StatCard
          title="Company Follows"
          value={(sections.companyFollows || []).length}
          icon="🏢"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <h3 className="text-xl font-semibold text-white">
            Detected Profile
          </h3>

          <p className="mt-4 text-sm text-slate-300">
            <b>Name:</b>{" "}
            {getProfileName(profile) || ownName || "Not detected"}
          </p>

          <p className="mt-2 text-sm text-slate-300">
            <b>Headline:</b>{" "}
            {profileAudit.headline || "Not detected"}
          </p>

          <p className="mt-2 text-sm text-slate-300">
            <b>Industry:</b>{" "}
            {profileAudit.industry || "Not detected"}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            <b>Summary:</b>{" "}
            {profileAudit.summary || "Not detected"}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <h3 className="text-xl font-semibold text-white">
            Suggestions
          </h3>

          <div className="mt-4 space-y-3">
            {profileAudit.suggestions.length ? (
              profileAudit.suggestions.map((tip) => (
                <div
                  key={tip}
                  className="flex gap-3 rounded-2xl bg-black/20 p-4 text-sm text-slate-300"
                >
                  <span className="text-emerald-300">✅</span>
                  {tip}
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-300">
                Your profile has strong basic structure. Keep adding proof
                through projects, posts, and achievements.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <MiniList
          title="Skills"
          rows={sections.skills || []}
          fields={["Name", "Skill", "Skill Name"]}
        />

        <MiniList
          title="Education"
          rows={sections.education || []}
          fields={[
            "School Name",
            "Degree",
            "Field Of Study",
            "Start Date"
          ]}
        />

        <MiniList
          title="Positions"
          rows={sections.positions || []}
          fields={[
            "Company",
            "Title",
            "Description",
            "Started On"
          ]}
        />

        <MiniList
          title="Certifications"
          rows={sections.certifications || []}
          fields={[
            "Name",
            "Authority",
            "Started On"
          ]}
        />

        <MiniList
          title="Company Follows"
          rows={sections.companyFollows || []}
          fields={[
            "Organization",
            "Company",
            "Followed On"
          ]}
        />

        <MiniList
          title="Rich Media"
          rows={sections.richMedia || []}
          fields={[
            "Title",
            "Link",
            "Date/Time"
          ]}
        />
      </div>
    </section>
  );
}