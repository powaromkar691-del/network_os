import { SECTION_FILES } from "../data/exportFiles";
import SimpleBarChart from "./SimpleBarChart";

export default function SectionCounts({ sections }) {
  const data = SECTION_FILES.map(([key, , label]) => {
    return {
      name: label,
      value: (sections[key] || []).length
    };
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <h3 className="mb-4 font-semibold text-white">
        Export Section Counts
      </h3>

      <SimpleBarChart data={data} />
    </div>
  );
}