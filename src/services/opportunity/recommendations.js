export function getOpportunityRecommendations(
  connections
) {
  return connections
    .filter((contact) => {
      return (
        contact.priorityScore >= 75 ||
        contact.relationshipType ===
          "Mentor Potential"
      );
    })
    .sort((a, b) => {
      return b.priorityScore - a.priorityScore;
    })
    .slice(0, 10)
    .map((contact) => ({
      id: contact.id,
      name: contact.fullName,
      company: contact.company,
      score: contact.priorityScore,
      reason:
        contact.relationshipType ===
        "Mentor Potential"
          ? "Potential mentor"
          : "High-priority connection"
    }));
}