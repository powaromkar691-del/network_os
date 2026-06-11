export function calculateMentorScore(contact) {
  let score = 0;
  const reasons = [];

  const role = (
    contact.position || ""
  ).toLowerCase();

  if (
    role.includes("director") ||
    role.includes("vp") ||
    role.includes("chief")
  ) {
    score += 25;
    reasons.push("Executive role");
  }

  if (
    role.includes("manager") ||
    role.includes("lead")
  ) {
    score += 15;
    reasons.push("Leadership role");
  }

  if (
    role.includes("founder")
  ) {
    score += 20;
    reasons.push("Founder experience");
  }

  if (
    role.includes("professor") ||
    role.includes("research")
  ) {
    score += 20;
    reasons.push("Research background");
  }

  if (
    contact.company &&
    contact.company !== "Unknown"
  ) {
    score += 10;
    reasons.push("Known company");
  }

  if (
    (contact.priorityScore || 0) > 80
  ) {
    score += 15;
    reasons.push("High-value connection");
  }

  if (
    role.includes("recruiter")
  ) {
    score -= 10;
  }

  return {
    score: Math.min(score, 100),
    reasons
  };
}