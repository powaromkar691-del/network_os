import { getValue } from "./csv";

export function buildProfileAudit(profile, sections, connections) {
  const headline = getValue(profile, [
    "Headline",
    "headline"
  ]);

  const summary = getValue(profile, [
    "Summary",
    "About",
    "summary"
  ]);

  const industry = getValue(profile, [
    "Industry",
    "industry"
  ]);

  const skills = sections.skills || [];
  const positions = sections.positions || [];
  const certifications = sections.certifications || [];
  const education = sections.education || [];
  const richMedia = sections.richMedia || [];
  const companyFollows = sections.companyFollows || [];

  let score = 30;

  const suggestions = [];

  if (headline.length > 20) {
    score += 15;
  } else {
    suggestions.push(
      "Add a clear headline with role, skills, and career direction."
    );
  }

  if (summary.length > 80) {
    score += 15;
  } else {
    suggestions.push(
      "Improve About/Summary with what you learn, what you build, and what you want."
    );
  }

  if (skills.length >= 8) {
    score += 15;
  } else {
    suggestions.push(
      "Add more real skills after practicing them: Python, C, DSA, Git, SQL, web basics."
    );
  }

  if (positions.length > 0) {
    score += 10;
  } else {
    suggestions.push(
      "Add leadership, college roles, internships, or project experience to Positions."
    );
  }

  if (certifications.length > 0) {
    score += 8;
  } else {
    suggestions.push(
      "Add meaningful certifications or project-based learning proof."
    );
  }

  if (education.length > 0) {
    score += 7;
  } else {
    suggestions.push(
      "Make sure your education section is complete."
    );
  }

  if (richMedia.length > 0) {
    score += 5;
  } else {
    suggestions.push(
      "Add project links, certificates, or portfolio screenshots to Featured/Rich Media."
    );
  }

  if (companyFollows.length >= 10) {
    score += 5;
  } else {
    suggestions.push(
      "Follow more targeted companies in SDE, AI/Data, quant, and startups."
    );
  }

  if (connections.length >= 100) {
    score += 5;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    headline,
    summary,
    industry,
    suggestions
  };
}

export function scoreMessageQuality(text) {
  const content = String(text || "");

  let score = 70;

  const flags = [];

  const questionCount = content.split("?").length - 1;

  if (content.length > 450) {
    score -= 20;
    flags.push("Too long");
  }

  if (questionCount > 2) {
    score -= 15;
    flags.push("Too many questions");
  }

  const lower = content.toLowerCase();

  const riskyPhrases = [
    "urgent",
    "please give referral",
    "need job",
    "help me get job",
    "give me internship"
  ];

  const hasRiskyPhrase = riskyPhrases.some((phrase) => {
    return lower.includes(phrase);
  });

  if (hasRiskyPhrase) {
    score -= 15;
    flags.push("Too needy/direct");
  }

  const hasClearAsk =
    content.includes("?") ||
    lower.includes("suggest") ||
    lower.includes("guide") ||
    lower.includes("advice") ||
    lower.includes("recommend");

  if (!hasClearAsk) {
    score -= 10;
    flags.push("No clear ask");
  }

  if (
    content.length > 60 &&
    content.length < 300 &&
    flags.length === 0
  ) {
    score += 15;
    flags.push("Strong concise ask");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    flags
  };
}

export function generateConnectionMessage(contact) {
  if (!contact) {
    return "Select a contact to generate a draft.";
  }

  const firstName =
    contact.firstName ||
    String(contact.fullName || "there").split(" ")[0];

  return (
    "Hi " +
    firstName +
    ", I noticed your work in " +
    contact.domain +
    " at " +
    (contact.company || "your field") +
    ". I am building my foundations and would value one practical suggestion for a beginner."
  );
}