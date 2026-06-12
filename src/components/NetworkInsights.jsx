export default function NetworkInsights({
  metrics,
  domainData,
  companyData
}) {
  const topDomain = domainData?.[0];
  const topCompany = companyData?.[0];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <h3 className="mb-4 font-semibold text-white">
        Network Insights
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-500">
            Strongest Domain
          </p>

          <p className="font-medium text-white">
            {topDomain?.name || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Strongest Company
          </p>

          <p className="font-medium text-white">
            {topCompany?.name || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Mentor Candidates
          </p>

          <p className="font-medium text-white">
            {metrics.mentors}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Recruiters
          </p>

          <p className="font-medium text-white">
            {metrics.recruiters}
          </p>
        </div>
      </div>
    </div>
  );
}