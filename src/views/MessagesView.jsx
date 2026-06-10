import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import { scoreMessageQuality } from "../lib/scoring";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MessagesView({
  messages,
  conversations,
  activeConversation,
  setSelectedConversation,
  ownName,
  setOwnName,
  reclassifyMessagesWithName,
  showMessages,
  setShowMessages,
  metrics
}) {
  return (
    <section>
      <SectionTitle
        eyebrow="Intelligence"
        title="Message Intelligence"
        subtitle="Messages extracted automatically from messages.csv inside the ZIP."
      />

      <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
        <label className="text-xs text-slate-400">
          Your LinkedIn name for outgoing/incoming detection
        </label>

        <div className="mt-2 flex flex-col gap-3 md:flex-row">
          <input
            value={ownName}
            onChange={(event) => setOwnName(event.target.value)}
            className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            placeholder="Example: Omkar Powar"
          />

          <button
            onClick={reclassifyMessagesWithName}
            className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-400"
          >
            Reclassify Messages
          </button>
        </div>
      </div>

      {!messages.length ? (
        <EmptyState
          title="No messages parsed"
          subtitle="Upload a LinkedIn ZIP containing messages.csv."
          icon="💬"
        />
      ) : (
        <>
          <div className="mb-5 grid gap-4 md:grid-cols-4">
            <StatCard
              title="Messages"
              value={messages.length}
              icon="💬"
            />

            <StatCard
              title="Conversations"
              value={conversations.length}
              icon="👥"
            />

            <StatCard
              title="Two-way"
              value={metrics.twoWay}
              icon="✅"
            />

            <StatCard
              title="Reply Rate"
              value={metrics.replyRate + "%"}
              icon="📊"
            />
          </div>

          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/10"
            >
              {showMessages ? "Hide Message Content" : "Reveal Message Content"}
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[340px_1fr_280px]">
            <div className="max-h-[650px] overflow-auto rounded-3xl border border-white/10 bg-white/[0.04] p-3">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={cx(
                    "mb-2 w-full rounded-2xl p-4 text-left transition",
                    activeConversation?.id === conversation.id
                      ? "bg-violet-500/20"
                      : "hover:bg-white/[0.06]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium text-white">
                      {conversation.title}
                    </p>

                    <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-slate-300">
                      {conversation.messageCount}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    {conversation.status}
                  </p>
                </button>
              ))}
            </div>

            <div className="max-h-[650px] overflow-auto rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="mb-4 font-semibold text-white">
                {activeConversation?.title || "Conversation"}
              </h3>

              <div className="space-y-3">
                {activeConversation?.messages?.map((message) => {
                  const quality = scoreMessageQuality(message.content);

                  return (
                    <div
                      key={message.id}
                      className={cx(
                        "rounded-3xl border border-white/10 p-4",
                        message.direction === "outgoing"
                          ? "ml-auto max-w-[82%] bg-violet-500/15"
                          : "mr-auto max-w-[82%] bg-white/[0.06]"
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-400">
                        <span>{message.from || "Unknown"}</span>
                        <span>{message.date || ""}</span>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">
                        {showMessages
                          ? message.content || "No content"
                          : "Message hidden for privacy."}
                      </p>

                      {message.direction === "outgoing" ? (
                        <p className="mt-2 text-[10px] text-violet-200">
                          Quality {quality.score}:{" "}
                          {quality.flags.join(", ") || "Clean"}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="font-semibold text-white">
                Thread Insights
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>
                  Messages:{" "}
                  <b className="text-white">
                    {activeConversation?.messageCount || 0}
                  </b>
                </p>

                <p>
                  Outgoing:{" "}
                  <b className="text-white">
                    {activeConversation?.outgoing || 0}
                  </b>
                </p>

                <p>
                  Incoming:{" "}
                  <b className="text-white">
                    {activeConversation?.incoming || 0}
                  </b>
                </p>

                <p>
                  Status:{" "}
                  <b className="text-white">
                    {activeConversation?.status || "—"}
                  </b>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}