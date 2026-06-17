import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ContactCard from "../components/ContactCard";

import {
  calculateCompanyOpportunity
} from "../services/intelligence/companyOpportunity";

import {
  buildPersonScore
} from "../services/intelligence/personScore";

export default function CompanyView({
  companyMap
}) {
  if (!companyMap.length) {
    return (
      <section>
        <SectionTitle
          eyebrow="Intelligence"
          title="Company Intelligence"
          subtitle="Discover which companies create the strongest opportunities."
        />

        <EmptyState
          title="No company data available"
          subtitle="Upload LinkedIn ZIP or load sample data."
          icon="🏢"
        />
      </section>
    );
  }

  const rankedCompanies =
    [...companyMap]
      .map((company) => ({
        ...company,
        opportunity:
          calculateCompanyOpportunity(
            company
          )
      }))
      .sort(
        (a, b) =>
          b.opportunity -
          a.opportunity
      );

  return (
    <section>
      <SectionTitle
        eyebrow="Intelligence"
        title="Company Intelligence"
        subtitle="Rank companies by actual opportunity potential."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {rankedCompanies
          .slice(0, 16)
          .map((company) => {
            const topPerson =
              company.people.reduce(
                (
                  best,
                  current
                ) => {
                  const currentScore =
                    buildPersonScore(
                      current
                    ).opportunity;

                  const bestScore =
                    buildPersonScore(
                      best
                    ).opportunity;

                  return currentScore >
                    bestScore
                    ? current
                    : best;
                }
              );

            return (
              <div
                key={
                  company.company
                }
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {
                        company.company
                      }
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {
                        company.count
                      }{" "}
                      contacts
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-200">
                    {
                      company.opportunity
                    }
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Metric
                    label="Recruiters"
                    value={
                      company.recruiters
                    }
                  />

                  <Metric
                    label="Mentors"
                    value={
                      company.mentors
                    }
                  />

                  <Metric
                    label="Avg Priority"
                    value={
                      company.averageScore
                    }
                  />

                  <Metric
                    label="Connections"
                    value={
                      company.count
                    }
                  />
                </div>

                <div className="mt-4 rounded-2xl bg-violet-500/10 p-4">
                  <p className="text-xs text-violet-300">
                    Best Opportunity
                  </p>

                  <p className="mt-2 font-medium text-white">
                    {
                      topPerson.fullName
                    }
                  </p>

                  <p className="text-sm text-slate-300">
                    {
                      topPerson.position
                    }
                  </p>
                </div>

                <div className="mt-4 grid gap-3">
                  {company.people
                    .slice(0, 3)
                    .map(
                      (
                        person
                      ) => (
                        <ContactCard
                          key={
                            company.company +
                            person.id
                          }
                          contact={
                            person
                          }
                        />
                      )
                    )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

function Metric({
  label,
  value
}) {
  return (
    <div className="rounded-xl bg-black/20 p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}