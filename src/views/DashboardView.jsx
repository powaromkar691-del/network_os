import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import SimpleBarChart from "../components/SimpleBarChart";
import SectionCounts from "../components/SectionCounts";
import OpportunitySnapshot from "../components/OpportunitySnapshot";
export default function DashboardView({
  connections,
  metrics,
  sections,
  profileAudit,
  domainData,
  companyData,
  mentorList
}) {
  if (!connections.length) {
    const topOpportunity =
     mentorList?.length
      ? mentorList[0]
      : connections[0];



    return (
      <section>
        <SectionTitle
          eyebrow="Command Center"
          title="Network Intelligence Dashboard"
          subtitle="Overview from the uploaded LinkedIn ZIP."
        />
        <div className="mb-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet-500/20 to-cyan-500/10 p-6">
          <p className="text-xs uppercase tracking-wider text-violet-300">
             Network Health
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white">
            {metrics.high}
          </h2>
          <p className="mt-2 text-slate-300">
            High-value connections identified in your network.
          </p>

          </div>
          <OpportunitySnapshot
            contact={topOpportunity}
          />
        </div>


        <EmptyState
          title="No data loaded yet"
          subtitle="Upload your LinkedIn ZIP or load the sample demo."
          icon="📊"
        />
      </section>
    );
  }

  return (
    <section>
      <SectionTitle
        eyebrow="Command Center"
        title="Network Intelligence Dashboard"
        subtitle="Overview from the uploaded LinkedIn ZIP."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Connections"
          value={connections.length}
          icon="🕸️"
        />

        <StatCard
          title="Companies"
          value={metrics.companies}
          icon="🏢"
        />

        <StatCard
          title="High Priority"
          value={metrics.high}
          icon="✨"
          hint="Score 75+"
        />

        <StatCard
          title="Reply Rate"
          value={metrics.replyRate + "%"}
          icon="💬"
        />

        <StatCard
          title="Recruiters"
          value={metrics.recruiters}
          icon="💼"
        />

        <StatCard
          title="Mentors"
          value={metrics.mentors}
          icon="🎯"
        />

        <StatCard
          title="Skills"
          value={(sections.skills || []).length}
          icon="🧠"
        />

        <StatCard
          title="Profile Score"
          value={profileAudit.score}
          icon="👤"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <h3 className="mb-4 font-semibold text-white">
            Domain Distribution
          </h3>

          <SimpleBarChart data={domainData} />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <h3 className="mb-4 font-semibold text-white">
            Top Companies
          </h3>

          <SimpleBarChart data={companyData} />
        </div>

        <SectionCounts sections={sections} />
      </div>
    </section>
  );
}