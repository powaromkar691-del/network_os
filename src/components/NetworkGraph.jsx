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

  const recommendation =
    networkHealth > 80
      ? "Strong network. Focus on deeper relationships."
      : networkHealth > 60
      ? "Good network. Increase mentor interactions."
      : "Grow your network and engage with more professionals.";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Network Health
          </h3>

          <p className="text-sm text-slate-400">
            Intelligence summary of your professional network.
          </p>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold text-white">
            {networkHealth}
          </p>

          <p className="text-xs text-slate-500">
            /100
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

        <Metric
          label="Recruiters"
          value={metrics.recruiters}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-black/20 p-4">
        <p className="text-xs uppercase tracking-wider text-violet-300">
          Recommendation
        </p>

        <p className="mt-2 text-sm text-slate-300">
          {recommendation}
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}