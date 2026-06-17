import { buildPersonScore } from "./personScore";
import { calculateRelationshipHealth } from "./relationshipHealth";

export function getDashboardInsights(
  connections,
  conversations
) {
  const people = connections.map(
    (person) => {
      const intelligence =
        buildPersonScore(person);

      const relationship =
        calculateRelationshipHealth(
          person,
          conversations
        );

      return {
        person,
        intelligence,
        relationship
      };
    }
  );

  const reconnects = people
    .filter(
      (item) =>
        item.relationship.status ===
        "Dormant"
    )
    .sort(
      (a, b) =>
        b.intelligence.opportunity -
        a.intelligence.opportunity
    )
    .slice(0, 5);

  const mentors = people
    .sort(
      (a, b) =>
        b.intelligence.mentor -
        a.intelligence.mentor
    )
    .slice(0, 5);

  return {
    reconnects,
    mentors
  };
}