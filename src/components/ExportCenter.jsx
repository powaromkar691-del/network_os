import { exportJSON } from "../services/export/exportJSON";
import { exportReport } from "../services/export/exportReport";

export default function ExportCenter({
  connections,
  metrics,
  domainData,
  companyData
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">
        Export Center
      </h3>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() =>
            exportJSON(
              "networkos_connections.json",
              connections
            )
          }
          className="rounded-2xl bg-violet-500 px-4 py-3 text-white"
        >
          Export JSON
        </button>

        <button
          onClick={() =>
            exportReport({
              metrics,
              domainData,
              companyData
            })
          }
          className="rounded-2xl bg-cyan-500 px-4 py-3 text-white"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}