export function calculateCompanyScore(company) {
  let score = 0;
  const reasons = [];

  score += Math.min(company.count * 2, 30);

  if (company.count > 0) {
    reasons.push(`${company.count} network connections`);
  }

  if (company.recruiters > 0) {
    score += 20;
    reasons.push("Recruiter presence");
  }

  if (company.mentors > 0) {
    score += 20;
    reasons.push("Mentor presence");
  }

  score += Math.min(
    Math.floor((company.averageScore || 0) / 5),
    30
  );

  if ((company.averageScore || 0) > 70) {
    reasons.push("Strong network quality");
  }

  return {
    score: Math.min(score, 100),
    reasons
  };
}