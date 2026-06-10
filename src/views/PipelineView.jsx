import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ContactCard from "../components/ContactCard";

export default function PipelineView({ connections, pipelineColumns }) {
  if (!connections.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="CRM"
          title="Relationship Pipeline"
          subtitle="A CRM-style board generated from your uploaded LinkedIn network."
        />

        <EmptyState
          title="No pipeline yet"
          subtitle="Upload LinkedIn ZIP or load the sample demo."
          icon="🧩"
        />
      </section>
    );
  }

  return (
    <section>
      <SectionTitle
        eyebrow="CRM"
        title="Relationship Pipeline"
        subtitle="A CRM-style board generated from your uploaded LinkedIn network."
      />

      <div className="grid gap-5 xl:grid-cols-4">
        {pipelineColumns.map(([title, list]) => (
          <div
            key={title}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">
                {title}
              </h3>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                {list.length}
              </span>
            </div>

            <div className="space-y-3">
              {list.map((contact) => (
                <ContactCard
                  key={title + contact.id}
                  contact={contact}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}