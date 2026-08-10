import {
  buildPersonScore
} from "./personScore";

import {
  calculateRelationshipHealth
} from "./relationshipHealth";

/**
 * Generates the most useful next action for a
 * connection using the existing NetworkOS
 * intelligence signals.
 *
 * No fixed opportunity buckets.
 * No generic career advice.
 *
 * The action is derived from:
 * - opportunity score
 * - mentor score
 * - recruiter score
 * - influence score
 * - priority score
 * - relationship health
 */

export function getRecommendedAction(
  person,
  conversations = []
) {
  if (!person) {
    return {
      type: "None",
      label: "No action",
      description:
        "No contact information available.",
      priority: 0,
      reason: "Missing contact data."
    };
  }

  const intelligence =
    buildPersonScore(person);

  const relationship =
    calculateRelationshipHealth(
      person,
      conversations
    );

  const signals = {
    opportunity:
      Number(
        intelligence.opportunity
      ) || 0,

    mentor:
      Number(
        intelligence.mentor
      ) || 0,

    recruiter:
      Number(
        intelligence.recruiter
      ) || 0,

    influence:
      Number(
        intelligence.influence
      ) || 0,

    priority:
      Number(
        intelligence.priority
      ) || 0,

    relationship:
      Number(
        relationship.score
      ) || 0
  };

  /*
   * Strong mentor + weak relationship:
   * relationship development should come first.
   */
  if (
    signals.mentor >= 70 &&
    relationship.status === "Dormant"
  ) {
    return {
      type: "Mentorship",
      label: "Start a mentorship conversation",
      description:
        "This person has strong mentor potential, but the relationship is currently inactive.",
      priority: 95,
      reason:
        "High mentor potential + dormant relationship.",
      signals,
      intelligence,
      relationship
    };
  }

  /*
   * Strong recruiter/career signal with an
   * already active relationship.
   */
  if (
    signals.recruiter >= 70 &&
    (
      relationship.status === "Warm" ||
      relationship.status === "Healthy"
    )
  ) {
    return {
      type: "Career",
      label: "Explore a career opportunity",
      description:
        "The contact has strong recruiter relevance and an existing relationship that supports a direct conversation.",
      priority: 92,
      reason:
        "High recruiter relevance + active relationship.",
      signals,
      intelligence,
      relationship
    };
  }

  /*
   * High opportunity but dormant relationship.
   */
  if (
    signals.opportunity >= 75 &&
    relationship.status === "Dormant"
  ) {
    return {
      type: "Reconnect",
      label: "Reconnect",
      description:
        "This contact has high opportunity potential but limited recent interaction.",
      priority: 88,
      reason:
        "High opportunity score + dormant relationship.",
      signals,
      intelligence,
      relationship
    };
  }

  /*
   * Strong influence with a healthy relationship:
   * maintain rather than aggressively pursue.
   */
  if (
    signals.influence >= 75 &&
    relationship.status === "Healthy"
  ) {
    return {
      type: "Maintain",
      label: "Maintain the relationship",
      description:
        "This is already a strong relationship with a highly influential contact.",
      priority: 80,
      reason:
        "High influence + healthy relationship.",
      signals,
      intelligence,
      relationship
    };
  }

  /*
   * Strong mentor potential with an existing
   * relationship.
   */
  if (
    signals.mentor >= 65 &&
    (
      relationship.status === "Warm" ||
      relationship.status === "Healthy"
    )
  ) {
    return {
      type: "Mentorship",
      label: "Ask a focused mentorship question",
      description:
        "The relationship is established enough for a focused question about their experience or career path.",
      priority: 78,
      reason:
        "Strong mentor potential + existing relationship.",
      signals,
      intelligence,
      relationship
    };
  }

  /*
   * High priority contact that doesn't fit
   * another stronger action.
   */
  if (
    signals.priority >= 75 &&
    relationship.status === "Warm"
  ) {
    return {
      type: "FollowUp",
      label: "Follow up",
      description:
        "This is a high-priority contact with an existing but not yet strong relationship.",
      priority: 72,
      reason:
        "High priority + warm relationship.",
      signals,
      intelligence,
      relationship
    };
  }

  /*
   * Moderate opportunity with a dormant
   * relationship.
   */
  if (
    signals.opportunity >= 55 &&
    relationship.status === "Dormant"
  ) {
    return {
      type: "Reconnect",
      label: "Consider reconnecting",
      description:
        "There is meaningful potential here, but the relationship is currently inactive.",
      priority: 60,
      reason:
        "Moderate opportunity + dormant relationship.",
      signals,
      intelligence,
      relationship
    };
  }

  /*
   * Default action.
   */
  return {
    type: "Monitor",
    label: "Keep on radar",
    description:
      "No immediate high-priority action is indicated from the available network signals.",
    priority: 30,
    reason:
      "No stronger action condition was detected.",
    signals,
    intelligence,
    relationship
  };
}

/**
 * Generate ranked actions for the entire network.
 */
export function getActionRecommendations(
  connections = [],
  conversations = [],
  limit = 20
) {
  return connections
    .map((person) => {
      const action =
        getRecommendedAction(
          person,
          conversations
        );

      return {
        contact: person,
        ...action
      };
    })
    .sort(
      (a, b) =>
        b.priority - a.priority
    )
    .slice(0, limit);
}

/**
 * Group recommendations by action type.
 */
export function groupActionRecommendations(
  recommendations = []
) {
  return recommendations.reduce(
    (groups, recommendation) => {
      const type =
        recommendation.type || "Monitor";

      if (!groups[type]) {
        groups[type] = [];
      }

      groups[type].push(
        recommendation
      );

      return groups;
    },
    {}
  );
}