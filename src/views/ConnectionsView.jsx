import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import MessageDraft from "../components/MessageDraft";

function escapeCSVValue(value) {
  return '"' + String(value ?? "").replaceAll('"', '""') + '"';
}

function downloadCSV(fileName, rows) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);

  const csvRows = rows.map((row) => {
    return headers
      .map((header) => escapeCSVValue(row[header]))
      .join(",");
  });

  const csv = [headers.join(","), ...csvRows].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
}

export default function ConnectionsView({
  connections,
  filteredConnections,
  domains,
  seniorities,
  query,
  setQuery,
  domainFilter,
  setDomainFilter,
  seniorityFilter,
  setSeniorityFilter,
  showEmails,
  setShowEmails,
  setSelectedContactId,
  selectedContact
}) {
  if (!connections.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Explorer"
          title="Connections Explorer"
          subtitle="Search, classify, filter, and export LinkedIn connections from ZIP."
        />

        <EmptyState
          title="No connections parsed"
          subtitle="Upload a LinkedIn ZIP containing Connections.csv."
          icon="🕸️"
        />
      </section>
    );
  }

  return (
    <section>
      <SectionTitle
        eyebrow="Explorer"
        title="Connections Explorer"
        subtitle="Search, classify, filter, and export LinkedIn connections from ZIP."
      />

      <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-4 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, company, role, domain..."
          className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
        />

        <select
          value={domainFilter}
          onChange={(event) => setDomainFilter(event.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
        >
          {domains.map((domain) => (
            <option key={domain}>{domain}</option>
          ))}
        </select>

        <select
          value={seniorityFilter}
          onChange={(event) => setSeniorityFilter(event.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
        >
          {seniorities.map((seniority) => (
            <option key={seniority}>{seniority}</option>
          ))}
        </select>

        <button
          onClick={() => setShowEmails(!showEmails)}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/10"
        >
          {showEmails ? "Hide Emails" : "Show Emails"}
        </button>

        <button
          onClick={() => downloadCSV("networkos_connections.csv", filteredConnections)}
          className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-400"
        >
          Export
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        <div className="max-h-[650px] overflow-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-950/95 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Position</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Seniority</th>
                <th className="p-4">Type</th>
                <th className="p-4">Score</th>
                <th className="p-4">Email</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredConnections.map((connection) => (
                <tr
                  key={connection.id}
                  onClick={() => setSelectedContactId(connection.id)}
                  className="cursor-pointer hover:bg-white/[0.04]"
                >
                  <td className="p-4 font-medium text-white">
                    {connection.fullName}
                  </td>

                  <td className="p-4 text-slate-300">
                    {connection.company || "—"}
                  </td>

                  <td className="p-4 text-slate-400">
                    {connection.position || "—"}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                      {connection.domain}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                      {connection.seniority}
                    </span>
                  </td>

                  <td className="p-4 text-slate-300">
                    {connection.relationshipType}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      {connection.priorityScore}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400">
                    {showEmails
                      ? connection.email || "—"
                      : connection.email
                        ? "••••••••"
                        : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5">
        <MessageDraft contact={selectedContact} />
      </div>
    </section>
  );
}