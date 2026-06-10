export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-bold text-white">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}