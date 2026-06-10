export default function SimpleBarChart({ data }) {
  const max = Math.max(
    1,
    ...data.map((item) => item.value || 0)
  );

  const colors = [
    "#8b5cf6",
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444"
  ];

  return (
    <div className="space-y-3">
      {data.slice(0, 10).map((item, index) => (
        <div key={item.name + index}>
          <div className="mb-1 flex justify-between gap-3 text-xs text-slate-400">
            <span className="truncate">
              {item.name}
            </span>

            <span>
              {item.value}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{
                width:
                  String(((item.value || 0) / max) * 100) +
                  "%",
                background: colors[index % colors.length]
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}