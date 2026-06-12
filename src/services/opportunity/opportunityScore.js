export function calculateOpportunityScore(
  contact,
  mentorScore = 0,
  companyScore = 0
) {
  const reasons = [];

  let score = contact.priorityScore || 0;

  score += Math.floor(mentorScore * 0.4);
  score += Math.floor(companyScore * 0.3);

  if ((contact.priorityScore || 0) > 80) {
    reasons.push("High priority connection");
  }

  if (mentorScore > 70) {
    reasons.push("Strong mentor potential");
  }

  if (companyScore > 70) {
    reasons.push("Strong company network");
  }

  if (
    contact.relationshipType ===
    "Mentor Potential"
  ) {
    reasons.push("Mentor candidate");
  }

  return {
    score: Math.min(score, 100),
    reasons
  };
}