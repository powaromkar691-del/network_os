import {
  buildPersonScore
} from "./personScore";

export function calculateCompanyOpportunity(
  company
) {
  if (
    !company.people?.length
  )
    return 0;

  const scores =
    company.people.map(
      buildPersonScore
    );

  const avgOpportunity =
    scores.reduce(
      (sum, item) =>
        sum +
        item.opportunity,
      0
    ) / scores.length;

  const avgMentor =
    scores.reduce(
      (sum, item) =>
        sum +
        item.mentor,
      0
    ) / scores.length;

  return Math.round(
    avgOpportunity * 0.7 +
      avgMentor * 0.3
  );
}