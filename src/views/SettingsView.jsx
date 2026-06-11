import { useState } from "react";

export default function SettingsView({
  ProfileComponent,
  PrivacyComponent
}) {
  const [tab, setTab] = useState("profile");

  const tabs = [
    ["profile", "Profile"],
    ["privacy", "Privacy"]
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

      {tab === "profile" && ProfileComponent}
      {tab === "privacy" && PrivacyComponent}
    </section>
  );
}