import { useState } from "react";

export default function NetworkView({
  ConnectionsComponent,
  MessagesComponent,
  PipelineComponent
}) {
  const [tab, setTab] = useState("connections");

  const tabs = [
    ["connections", "Connections"],
    ["messages", "Messages"],
    ["pipeline", "Pipeline"]
  ];

  return (
    <section>
      <div className="mb-6 flex gap-3">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={
              tab === id
                ? "rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white"
                : "rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-300"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "connections" && ConnectionsComponent}
      {tab === "messages" && MessagesComponent}
      {tab === "pipeline" && PipelineComponent}
    </section>
  );
}