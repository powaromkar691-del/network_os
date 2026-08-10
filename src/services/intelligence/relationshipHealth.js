/**
 * Relationship Health Engine
 *
 * Calculates the strength of an existing relationship
 * using the actual conversation data available for a contact.
 *
 * Output:
 * {
 *   score: number,
 *   status: "Healthy" | "Warm" | "Dormant",
 *   interactionCount: number,
 *   twoWayInteractions: number
 * }
 */

export function calculateRelationshipHealth(
  person,
  conversations = []
) {
  if (!person) {
    return {
      score: 0,
      status: "Dormant",
      interactionCount: 0,
      twoWayInteractions: 0
    };
  }

  const personName = normalizeText(
    person.fullName
  );

  if (!personName) {
    return {
      score: 0,
      status: "Dormant",
      interactionCount: 0,
      twoWayInteractions: 0
    };
  }

  const relatedConversations =
    conversations.filter((conversation) =>
      conversationBelongsToPerson(
        conversation,
        personName
      )
    );

  if (!relatedConversations.length) {
    return {
      score: 20,
      status: "Dormant",
      interactionCount: 0,
      twoWayInteractions: 0
    };
  }

  const interactionCount =
    relatedConversations.length;

  const twoWayInteractions =
    relatedConversations.filter(
      isTwoWayConversation
    ).length;

  /*
   * Interaction depth
   *
   * More interactions indicate an established
   * relationship, but the contribution is capped.
   */
  const interactionScore = Math.min(
    40,
    interactionCount * 8
  );

  /*
   * Two-way communication is a stronger signal
   * than simply having messages.
   */
  const twoWayScore = Math.min(
    40,
    twoWayInteractions * 20
  );

  /*
   * Having at least one meaningful interaction
   * prevents every active relationship from being
   * judged only by message count.
   */
  const relationshipBase =
    interactionCount > 0 ? 20 : 0;

  const score = Math.min(
    100,
    Math.round(
      relationshipBase +
        interactionScore +
        twoWayScore
    )
  );

  return {
    score,
    status: getRelationshipStatus(
      score
    ),
    interactionCount,
    twoWayInteractions
  };
}

/**
 * Determines whether a conversation belongs
 * to the supplied person.
 *
 * We check several common fields instead of relying
 * only on conversation.title.
 */
function conversationBelongsToPerson(
  conversation,
  personName
) {
  const searchableFields = [
    conversation?.title,
    conversation?.name,
    conversation?.fullName,
    conversation?.participant,
    conversation?.personName,
    conversation?.contactName,
    conversation?.from,
    conversation?.to
  ];

  return searchableFields.some(
    (value) =>
      normalizeText(value).includes(
        personName
      )
  );
}

/**
 * Determines whether the interaction appears
 * to be two-way.
 *
 * The existing application uses "Two-way",
 * so that remains the primary signal.
 */
function isTwoWayConversation(
  conversation
) {
  const status = normalizeText(
    conversation?.status
  );

  if (
    status === "two-way" ||
    status === "two way"
  ) {
    return true;
  }

  /*
   * Support explicit boolean fields if they
   * become available later.
   */
  if (
    conversation?.twoWay === true ||
    conversation?.isTwoWay === true
  ) {
    return true;
  }

  return false;
}

function getRelationshipStatus(
  score
) {
  if (score >= 75) {
    return "Healthy";
  }

  if (score >= 50) {
    return "Warm";
  }

  return "Dormant";
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}