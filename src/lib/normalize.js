import { DOMAIN_RULES, SENIORITY_RULES } from "../data/rules";
import { SECTION_FILES } from "../data/exportFiles";
import { getValue, parseCSV } from "./csv";
import { findExportText } from "./zip";

function includesAny(text, words) {
  const safe = String(text || "").toLowerCase();

  return words.some((word) => {
    return safe.includes(String(word).toLowerCase());
  });
}

export function classifyDomain(position = "", company = "") {
  const text = String(position || "") + " " + String(company || "");

  const found = DOMAIN_RULES.find((rule) => {
    const words = rule[1];
    return includesAny(text, words);
  });

  return found ? found[0] : "Unknown";
}

export function classifySeniority(position = "") {
  const found = SENIORITY_RULES.find((rule) => {
    const words = rule[1];
    return includesAny(position, words);
  });

  return found ? found[0] : "Unknown";
}

export function getRelationshipType(domain, seniority) {
  if (domain === "Recruiter / HR") {
    return "Recruiter Contact";
  }

  if (domain === "Academia / Research") {
    return "Research Contact";
  }

  if (domain === "Founder / Startup") {
    return "Startup Contact";
  }

  if (
    [
      "Director",
      "VP / CXO",
      "Founder",
      "Professor / Researcher",
      "Manager",
      "Lead",
      "Senior"
    ].includes(seniority)
  ) {
    return "Mentor Potential";
  }

  if (domain === "College / Student") {
    return "Peer / Senior";
  }

  if (
    [
      "Software Engineering",
      "AI / ML",
      "Data Science",
      "Finance / Quant"
    ].includes(domain)
  ) {
    return "Referral Potential";
  }

  return "Low Priority";
}

export function scoreConnection(connection) {
  let score = 40;

  if (connection.domain !== "Unknown") {
    score += 18;
  }

  if (
    [
      "Director",
      "VP / CXO",
      "Founder",
      "Professor / Researcher"
    ].includes(connection.seniority)
  ) {
    score += 20;
  } else if (
    [
      "Senior",
      "Lead",
      "Manager"
    ].includes(connection.seniority)
  ) {
    score += 15;
  } else if (
    [
      "Intern",
      "Student"
    ].includes(connection.seniority)
  ) {
    score += 6;
  }

  if (
    [
      "Recruiter Contact",
      "Research Contact",
      "Startup Contact",
      "Mentor Potential"
    ].includes(connection.relationshipType)
  ) {
    score += 12;
  }

  if (connection.company) {
    score += 5;
  }

  if (connection.position) {
    score += 5;
  }

  if (!connection.company || !connection.position) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

export function normalizeConnection(row, index) {
  const firstName = getValue(row, [
    "First Name",
    "FirstName",
    "firstName"
  ]);

  const lastName = getValue(row, [
    "Last Name",
    "LastName",
    "lastName"
  ]);

  const company = getValue(row, [
    "Company",
    "company"
  ]);

  const position = getValue(row, [
    "Position",
    "Title",
    "Role",
    "position"
  ]);

  const fullName =
    getValue(row, [
      "Full Name",
      "Name",
      "fullName"
    ]) ||
    (firstName + " " + lastName).trim() ||
    "Connection " + (index + 1);

  const domain = classifyDomain(position, company);
  const seniority = classifySeniority(position);
  const relationshipType = getRelationshipType(domain, seniority);

  const base = {
    id: "connection-" + index,
    firstName,
    lastName,
    fullName,
    email: getValue(row, [
      "Email Address",
      "Email",
      "email"
    ]),
    company,
    position,
    connectedOn: getValue(row, [
      "Connected On",
      "ConnectedOn",
      "Date",
      "connectedOn"
    ]),
    domain,
    seniority,
    relationshipType
  };

  return {
    ...base,
    priorityScore: scoreConnection(base)
  };
}

export function normalizeMessage(row, index, ownName = "Omkar Powar") {
  const from = getValue(row, [
    "FROM",
    "From",
    "from"
  ]);

  const to = getValue(row, [
    "TO",
    "To",
    "to"
  ]);

  const own = String(ownName || "").toLowerCase();

  let direction = "unknown";

  if (own && from.toLowerCase().includes(own)) {
    direction = "outgoing";
  }

  if (own && to.toLowerCase().includes(own)) {
    direction = "incoming";
  }

  return {
    id: "message-" + index,
    conversationId:
      getValue(row, [
        "CONVERSATION ID",
        "Conversation ID",
        "conversationId"
      ]) || "conversation-" + index,
    title: getValue(row, [
      "CONVERSATION TITLE",
      "Conversation Title",
      "SUBJECT",
      "Subject"
    ]),
    from,
    to,
    date: getValue(row, [
      "DATE",
      "Date",
      "date"
    ]),
    content: getValue(row, [
      "CONTENT",
      "Content",
      "Body",
      "content"
    ]),
    direction
  };
}

export function getProfileName(profile) {
  const firstName = getValue(profile, [
    "First Name",
    "FirstName",
    "firstName"
  ]);

  const lastName = getValue(profile, [
    "Last Name",
    "LastName",
    "lastName"
  ]);

  const fullName =
    (firstName + " " + lastName).trim() ||
    getValue(profile, [
      "Name",
      "Full Name",
      "fullName"
    ]);

  return fullName;
}

export function parseLinkedInSections(files) {
  const sections = {};

  SECTION_FILES.forEach(([key, fileName]) => {
    const text = findExportText(files, fileName);
    sections[key] = parseCSV(text);
  });

  return sections;
}

export function normalizeConnections(rows) {
  return rows
    .map((row, index) => normalizeConnection(row, index))
    .filter((connection) => connection.fullName);
}

export function normalizeMessages(rows, ownName) {
  return rows
    .map((row, index) => normalizeMessage(row, index, ownName))
    .filter((message) => {
      return message.from || message.to || message.content;
    });
}