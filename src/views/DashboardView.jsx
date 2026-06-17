import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import SimpleBarChart from "../components/SimpleBarChart";
import SectionCounts from "../components/SectionCounts";
import NetworkGraph from "../components/NetworkGraph";
import ExportCenter from "../components/ExportCenter";

export default function DashboardView({
  connections,
  metrics,
  sections,
  profileAudit,
  domainData,
  companyData,
  dashboardInsights
}) {
  if (!connections.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Command Center"
          title="Network Intelligence Dashboard"
          subtitle="Overview from the uploaded LinkedIn ZIP."
        />

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

      <div className="mt-6">
        <NetworkGraph
          metrics={metrics}
          domainData={domainData}
          companyData={companyData}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <h3 className="mb-4 font-semibold text-white">
            Recommended Reconnects
          </h3>

          <div className="space-y-3">
            {dashboardInsights?.reconnects?.map(
              ({
                person,
                intelligence,
                relationship
              }) => (
                <div
                  key={person.id}
                  className="rounded-xl bg-black/20 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">
                      {person.fullName}
                    </p>

                    <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-300">
                      {intelligence.opportunity}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400">
                    {person.company}
                  </p>

                  <p className="mt-1 text-xs text-amber-300">
                    {relationship.status}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <h3 className="mb-4 font-semibold text-white">
            Top Mentors
          </h3>

          <div className="space-y-3">
            {dashboardInsights?.mentors?.map(
              ({
                person,
                intelligence
              }) => (
                <div
                  key={person.id}
                  className="rounded-xl bg-black/20 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">
                      {person.fullName}
                    </p>

                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                      {intelligence.mentor}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400">
                    {person.position}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

      </div>

      <div className="mt-6">
        <ExportCenter
          connections={connections}
          metrics={metrics}
          domainData={domainData}
          companyData={companyData}
        />
      </div>
    </section>
  );
}