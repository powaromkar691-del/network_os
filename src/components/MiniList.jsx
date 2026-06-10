import { getValue } from "../lib/csv";

export default function MiniList({ title, rows, fields }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <h3 className="font-semibold text-white">
        {title}
      </h3>

      {rows.length ? (
        <div className="mt-4 space-y-2">
          {rows.slice(0, 8).map((row, index) => (
            <div
              key={index}
              className="rounded-2xl bg-black/20 p-3 text-xs text-slate-300"
            >
              {fields
                .map((field) => getValue(row, [field]))
                .filter(Boolean)
                .join(" · ") || "Row " + (index + 1)}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No data found.
        </p>
      )}
    </div>
  );
}