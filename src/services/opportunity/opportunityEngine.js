export function getTopOpportunities(
  connections
) {
  return connections
    .map((contact) => {
      const reasons = [];

      let score =
        contact.priorityScore || 0;

      if (
        contact.relationshipType ===
        "Mentor Potential"
      ) {
        score += 15;
        reasons.push(
          "Mentor Potential"
        );
      }

      if (
        contact.domain ===
        "Recruiter / HR"
      ) {
        score += 10;
        reasons.push("Recruiter");
      }

      if (
        contact.domain ===
        "Founder / Startup"
      ) {
        score += 10;
        reasons.push("Founder");
      }

      if (
        contact.domain ===
        "Academia / Research"
      ) {
        score += 10;
        reasons.push("Research");
      }

      if (
        (contact.priorityScore || 0) > 80
      ) {
        reasons.push(
          "High Priority"
        );
      }

      return {
        contact,
        score: Math.min(
          score,
          100
        ),
        reasons
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 20);
}