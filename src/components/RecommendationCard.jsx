export default function RecommendationCard({
  recommendation
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <h3 className="font-semibold text-white">
        {recommendation.name}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {recommendation.company}
      </p>

      <p className="mt-3 text-sm text-slate-300">
        {recommendation.reason}
      </p>

      <div className="mt-4 inline-flex rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
        Score {recommendation.score}
      </div>
    </div>
  );
}