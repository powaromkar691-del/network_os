import { useMemo, useState } from "react";

import {
  SAMPLE_CONNECTIONS,
  SAMPLE_MESSAGES,
  SAMPLE_SECTIONS
} from "./data/sampleData";

import { parseCSV } from "./lib/csv";

import {
  readLinkedInZip,
  findExportText
} from "./lib/zip";

import {
  parseLinkedInSections,
  normalizeConnections,
  normalizeMessages,
  getProfileName
} from "./lib/normalize";

import {
  summarizeBy,
  groupConversations,
  buildCompanyMap,
  getPipelineColumns,
  getMentorList,
  getNetworkMetrics,
  copilotAnswer
} from "./lib/analytics";

import { buildProfileAudit } from "./lib/scoring";

import UploadView from "./views/UploadView";
import DashboardView from "./views/DashboardView";
import ConnectionsView from "./views/ConnectionsView";
import MessagesView from "./views/MessagesView";
import PipelineView from "./views/PipelineView";
import PrivacyView from "./views/PrivacyView";
import ProfileView from "./views/ProfileView";
import CompanyView from "./views/CompanyView";
import MentorView from "./views/MentorView";
import OpportunityView from "./views/OpportunityView";
import CopilotView from "./views/CopilotView";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  const [active, setActive] = useState("upload");

  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);

  const [sections, setSections] = useState({});
  const [profile, setProfile] = useState({});

  const [zipName, setZipName] = useState("");
  const [ownName, setOwnName] = useState("Omkar Powar");

  const [status, setStatus] = useState("Upload your LinkedIn ZIP export.");
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [seniorityFilter, setSeniorityFilter] = useState("All");

  const [showEmails, setShowEmails] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);

  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotHistory, setCopilotHistory] = useState([]);

  function loadSampleData() {
    const normalizedConnections = normalizeConnections(SAMPLE_CONNECTIONS);
    const normalizedMessages = normalizeMessages(SAMPLE_MESSAGES, ownName);

    setConnections(normalizedConnections);
    setMessages(normalizedMessages);

    setFiles([
      { name: "Connections.csv", size: normalizedConnections.length },
      { name: "messages.csv", size: normalizedMessages.length },
      { name: "Profile.csv", size: 1 },
      { name: "Skills.csv", size: SAMPLE_SECTIONS.skills.length }
    ]);

    setSections(SAMPLE_SECTIONS);
    setProfile(SAMPLE_SECTIONS.profile[0]);

    setZipName("sample-linkedin-export.zip");
    setStatus("Sample demo loaded.");

    setActive("dashboard");
  }

  async function handleZip(file) {
    try {
      setError("");
      setStatus("Extracting ZIP locally in your browser...");
      setZipName(file.name);

      const extractedFiles = await readLinkedInZip(file);

      const parsedSections = parseLinkedInSections(extractedFiles);

      const profileRow = (parsedSections.profile || [])[0] || {};
      const detectedName = getProfileName(profileRow);

      const activeName =
        detectedName ||
        ownName.trim() ||
        "Omkar Powar";

      const connectionRows = parseCSV(
        findExportText(extractedFiles, "Connections.csv")
      );

      const messageRows = parseCSV(
        findExportText(extractedFiles, "messages.csv")
      );

      const normalizedConnections = normalizeConnections(connectionRows);
      const normalizedMessages = normalizeMessages(messageRows, activeName);

      setFiles(extractedFiles);
      setSections(parsedSections);
      setProfile(profileRow);

      if (detectedName) {
        setOwnName(detectedName);
      }

      setConnections(normalizedConnections);
      setMessages(normalizedMessages);

      setStatus(
        "ZIP extracted. Files: " +
          extractedFiles.length +
          ". Connections: " +
          normalizedConnections.length +
          ". Messages: " +
          normalizedMessages.length +
          "."
      );

      setActive("dashboard");
    } catch (err) {
      setError(String(err?.message || err));
      setStatus("ZIP extraction failed.");
    }
  }

  function reclassifyMessagesWithName() {
    setMessages((previousMessages) => {
      return previousMessages.map((message, index) => {
        return {
          ...message,
          ...normalizeMessages([message], ownName)[0],
          id: message.id || "message-" + index
        };
      });
    });
  }

  const domainData = useMemo(() => {
    return summarizeBy(connections, "domain");
  }, [connections]);

  const seniorityData = useMemo(() => {
    return summarizeBy(connections, "seniority");
  }, [connections]);

  const companyData = useMemo(() => {
    return summarizeBy(connections, "company")
      .filter((item) => item.name !== "Unknown")
      .slice(0, 10);
  }, [connections]);

  const conversations = useMemo(() => {
    return groupConversations(messages);
  }, [messages]);

  const activeConversation = useMemo(() => {
    if (selectedConversationId) {
      return conversations.find((item) => {
        return item.id === selectedConversationId;
      });
    }

    return conversations[0];
  }, [conversations, selectedConversationId]);

  const selectedContact = useMemo(() => {
    return (
      connections.find((item) => {
        return item.id === selectedContactId;
      }) || connections[0]
    );
  }, [connections, selectedContactId]);

  const domains = useMemo(() => {
    return ["All", ...domainData.map((item) => item.name)];
  }, [domainData]);

  const seniorities = useMemo(() => {
    return ["All", ...seniorityData.map((item) => item.name)];
  }, [seniorityData]);

  const filteredConnections = useMemo(() => {
    const q = query.toLowerCase().trim();

    return connections.filter((connection) => {
      const text = (
        connection.fullName +
        " " +
        connection.company +
        " " +
        connection.position +
        " " +
        connection.domain
      ).toLowerCase();

      const matchesSearch = !q || text.includes(q);
      const matchesDomain =
        domainFilter === "All" || connection.domain === domainFilter;
      const matchesSeniority =
        seniorityFilter === "All" ||
        connection.seniority === seniorityFilter;

      return matchesSearch && matchesDomain && matchesSeniority;
    });
  }, [
    connections,
    query,
    domainFilter,
    seniorityFilter
  ]);

  const profileAudit = useMemo(() => {
    return buildProfileAudit(profile, sections, connections);
  }, [
    profile,
    sections,
    connections
  ]);

  const companyMap = useMemo(() => {
    return buildCompanyMap(connections);
  }, [connections]);

  const pipelineColumns = useMemo(() => {
    return getPipelineColumns(connections, conversations);
  }, [
    connections,
    conversations
  ]);

  const mentorList = useMemo(() => {
    return getMentorList(connections);
  }, [connections]);

  const metrics = useMemo(() => {
    return getNetworkMetrics(connections, conversations, messages);
  }, [
    connections,
    conversations,
    messages
  ]);

  function askCopilot(text) {
    const q = text || copilotQuery;

    const answer = copilotAnswer(
      q,
      connections,
      profileAudit
    );

    setCopilotHistory((previous) => {
      return [
        { q, answer },
        ...previous
      ].slice(0, 10);
    });

    setCopilotQuery("");
  }

  const nav = [
    ["upload", "Upload", "⬆️"],
    ["dashboard", "Command Center", "📊"],
    ["connections", "Connections", "🕸️"],
    ["messages", "Messages", "💬"],
    ["pipeline", "Pipeline", "🧩"],
    ["mentor", "Mentor Radar", "🎯"],
    ["company", "Company Map", "🏢"],
    ["opportunity", "Opportunity", "🚀"],
    ["profile", "Profile Audit", "👤"],
    ["copilot", "Copilot", "🤖"],
    ["privacy", "Privacy", "🛡️"]
  ];

  return (
    <div className="min-h-screen bg-[#060816] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/20 p-5 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-violet-500 p-3 text-2xl">
              🕸️
            </div>

            <div>
              <h1 className="text-xl font-bold">
                NetworkOS
              </h1>

              <p className="text-xs text-slate-400">
                Your network, decoded.
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {nav.map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cx(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
                  active === id
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-emerald-300">
              🛡️ Privacy-first
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              ZIP is extracted locally in browser. No scraping. No auto-send.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-slate-400">
                NetworkOS ZIP prototype
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {zipName || "No ZIP loaded"} · {status}
              </p>

              {error ? (
                <p className="mt-1 text-xs text-red-300">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadSampleData}
                className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-200"
              >
                Load Sample Demo
              </button>

              <label className="cursor-pointer rounded-2xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
                Upload LinkedIn ZIP

                <input
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      handleZip(file);
                    }
                  }}
                />
              </label>
            </div>
          </header>

          {active === "upload" && (
            <UploadView
              files={files}
              loadSampleData={loadSampleData}
              handleZip={handleZip}
            />
          )}

          {active === "dashboard" && (
            <DashboardView
              connections={connections}
              metrics={metrics}
              sections={sections}
              profileAudit={profileAudit}
              domainData={domainData}
              companyData={companyData}
            />
          )}

          {active === "connections" && (
            <ConnectionsView
              connections={connections}
              filteredConnections={filteredConnections}
              domains={domains}
              seniorities={seniorities}
              query={query}
              setQuery={setQuery}
              domainFilter={domainFilter}
              setDomainFilter={setDomainFilter}
              seniorityFilter={seniorityFilter}
              setSeniorityFilter={setSeniorityFilter}
              showEmails={showEmails}
              setShowEmails={setShowEmails}
              setSelectedContactId={setSelectedContactId}
              selectedContact={selectedContact}
            />
          )}

          {active === "messages" && (
            <MessagesView
              messages={messages}
              conversations={conversations}
              activeConversation={activeConversation}
              setSelectedConversation={setSelectedConversationId}
              ownName={ownName}
              setOwnName={setOwnName}
              reclassifyMessagesWithName={reclassifyMessagesWithName}
              showMessages={showMessages}
              setShowMessages={setShowMessages}
              metrics={metrics}
            />
          )}

          {active === "pipeline" && (
            <PipelineView
              connections={connections}
              pipelineColumns={pipelineColumns}
            />
          )}

          {active === "mentor" && (
            <MentorView mentorList={mentorList} />
          )}

          {active === "company" && (
            <CompanyView companyMap={companyMap} />
          )}

          {active === "opportunity" && (
            <OpportunityView connections={connections} />
          )}

          {active === "profile" && (
            <ProfileView
              profile={profile}
              profileAudit={profileAudit}
              sections={sections}
              ownName={ownName}
            />
          )}

          {active === "copilot" && (
            <CopilotView
              copilotQuery={copilotQuery}
              setCopilotQuery={setCopilotQuery}
              askCopilot={askCopilot}
              copilotHistory={copilotHistory}
            />
          )}

          {active === "privacy" && (
            <PrivacyView />
          )}
        </main>
      </div>
    </div>
  );
}