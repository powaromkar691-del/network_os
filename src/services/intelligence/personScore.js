export function buildPersonScore(person) {
  const priority =
    person.priorityScore || 0;

  const mentor =
    calculateMentorPotential(person);

  const influence =
    calculateInfluence(person);

  const recruiter =
    person.domain ===
    "Recruiter / HR"
      ? 100
      : 0;

  const founder =
    person.domain ===
    "Founder / Startup"
      ? 100
      : 0;

  const opportunity =
    Math.round(
      priority * 0.4 +
      mentor * 0.25 +
      influence * 0.2 +
      recruiter * 0.1 +
      founder * 0.05
    );

  return {
    priority,
    mentor,
    influence,
    recruiter,
    founder,
    opportunity
  };
}

function calculateMentorPotential(
  person
) {
  let score = 0;

  if (
    person.relationshipType ===
    "Mentor Potential"
  )
    score += 50;

  if (
    person.domain ===
    "Academia / Research"
  )
    score += 25;

  if (
    person.domain ===
    "Founder / Startup"
  )
    score += 20;

  if (
    person.seniority === "Senior"
  )
    score += 20;

  if (
    person.seniority ===
    "Executive"
  )
    score += 30;

  return Math.min(score, 100);
}

function calculateInfluence(person) {
  let score = 0;

  if (
    person.seniority === "Executive"
  )
    score += 50;

  if (
    person.seniority === "Senior"
  )
    score += 30;

  if (
    person.company &&
    person.company !== "Unknown"
  )
    score += 20;

  return Math.min(score, 100);
}