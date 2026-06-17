export default function NetworkGraph({
  metrics,
  domainData,
  companyData
}) {
  const topDomain =
    domainData?.[0]?.name || "N/A";

  const topCompany =
    companyData?.[0]?.name || "N/A";

  const networkHealth = Math.min(
    100,
    Math.round(
      (
        metrics.high * 2 +
        metrics.mentors * 3 +
        metrics.recruiters +
        metrics.replyRate
      ) / 5
    )
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">
        Network Health
      </h3>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Health Score"
          value={networkHealth}
        />

        <Metric
          label="Top Domain"
          value={topDomain}
        />

        <Metric
          label="Top Company"
          value={topCompany}
        />

        <Metric
          label="Mentors"
          value={metrics.mentors}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}