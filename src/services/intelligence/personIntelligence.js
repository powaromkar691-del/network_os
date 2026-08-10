import {
  buildPersonScore
} from "./personScore";

import {
  calculateRelationshipHealth
} from "./relationshipHealth";

/**
 * Builds the complete intelligence profile
 * for one person.
 *
 * This is the single entry point that views
 * should use instead of independently calling
 * multiple intelligence engines.
 */
export function buildPersonIntelligence(
  person,
  conversations = []
) {
  if (!person) {
    return null;
  }

  const score =
    buildPersonScore(person);

  const relationship =
    calculateRelationshipHealth(
      person,
      conversations
    );

  return {
    person,

    scores: {
      opportunity:
        Number(score?.opportunity) || 0,

      mentor:
        Number(score?.mentor) || 0,

      recruiter:
        Number(score?.recruiter) || 0,

      influence:
        Number(score?.influence) || 0,

      priority:
        Number(score?.priority) || 0
    },

    relationship: {
      score:
        Number(
          relationship?.score
        ) || 0,

      status:
        relationship?.status ||
        "Dormant",

      interactionCount:
        Number(
          relationship?.interactionCount
        ) || 0,

      twoWayInteractions:
        Number(
          relationship?.twoWayInteractions
        ) || 0
    }
  };
}

/**
 * Builds intelligence profiles for the
 * complete network.
 */
export function buildNetworkIntelligence(
  connections = [],
  conversations = []
) {
  return connections
    .map((person) =>
      buildPersonIntelligence(
        person,
        conversations
      )
    )
    .filter(Boolean);
}

/**
 * Find the strongest people according to
 * a specific intelligence dimension.
 *
 * Example:
 *
 * getTopPeople(
 *   intelligence,
 *   "opportunity",
 *   10
 * )
 */
export function getTopPeople(
  intelligence = [],
  dimension,
  limit = 10
) {
  return [...intelligence]
    .sort(
      (a, b) =>
        (b.scores?.[dimension] || 0) -
        (a.scores?.[dimension] || 0)
    )
    .slice(0, limit);
}

/**
 * Find people whose relationship is currently
 * in a particular state.
 */
export function getPeopleByRelationship(
  intelligence = [],
  status
) {
  return intelligence.filter(
    (item) =>
      item.relationship?.status ===
      status
  );
}

/**
 * Find people with meaningful opportunity
 * and an existing relationship.
 *
 * This is intentionally a signal query rather
 * than an instruction to perform an action.
 */
export function getWarmOpportunities(
  intelligence = [],
  limit = 10
) {
  return intelligence
    .filter(
      (item) =>
        item.relationship?.status ===
          "Warm" &&
        item.scores?.opportunity >= 50
    )
    .sort(
      (a, b) =>
        (b.scores?.opportunity || 0) -
        (a.scores?.opportunity || 0)
    )
    .slice(0, limit);
}

/**
 * Find strong mentor candidates while taking
 * relationship context into account.
 */
export function getMentorCandidates(
  intelligence = [],
  limit = 10
) {
  return intelligence
    .filter(
      (item) =>
        (item.scores?.mentor || 0) >= 50
    )
    .sort(
      (a, b) =>
        (b.scores?.mentor || 0) -
        (a.scores?.mentor || 0)
    )
    .slice(0, limit);
}

/**
 * Find dormant high-value relationships.
 *
 * These are useful signals for the future
 * Network Intelligence Feed.
 */
export function getDormantHighValuePeople(
  intelligence = [],
  limit = 10
) {
  return intelligence
    .filter(
      (item) =>
        item.relationship?.status ===
          "Dormant" &&
        Math.max(
          item.scores?.opportunity || 0,
          item.scores?.mentor || 0,
          item.scores?.influence || 0,
          item.scores?.recruiter || 0
        ) >= 60
    )
    .sort(
      (a, b) =>
        getHighestSignal(b) -
        getHighestSignal(a)
    )
    .slice(0, limit);
}

function getHighestSignal(
  intelligence
) {
  return Math.max(
    intelligence.scores?.opportunity || 0,
    intelligence.scores?.mentor || 0,
    intelligence.scores?.influence || 0,
    intelligence.scores?.recruiter || 0
  );
}