import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ContactCard from "../components/ContactCard";
import { calculateCompanyScore } from "../services/company/companyScore";

export default function CompanyView({ companyMap }) {
  if (!companyMap.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Map"
          title="Company Map"
          subtitle="See where your network is concentrated and which companies have warm potential."
        />

        <EmptyState
          title="No company map yet"
          subtitle="Upload LinkedIn ZIP or load the sample demo."
          icon="🏢"
        />
      </section>
    );
  }

  return (
    <section>
      <SectionTitle
        eyebrow="Map"
        title="Company Map"
        subtitle="See where your professional network is concentrated and which companies have warm potential."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {companyMap.slice(0, 16).map((item) => {
          const company = calculateCompanyScore(item);

          return (
            <div
              key={item.company}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {item.company}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {item.count} contacts · Avg score {item.averageScore} ·{" "}
                    {item.recruiters} recruiters · {item.mentors} mentors
                  </p>

                  <div className="mt-4 rounded-2xl bg-violet-500/10 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-violet-200">
                        Opportunity Score
                      </span>

                      <span className="font-semibold text-white">
                        {company.score}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {company.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-slate-300"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
                  {item.count}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {item.people.slice(0, 4).map((person) => (
                  <ContactCard
                    key={item.company + person.id}
                    contact={person}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}