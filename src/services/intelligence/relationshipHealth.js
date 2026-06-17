export function calculateRelationshipHealth(
  person,
  conversations = []
) {
  const related =
    conversations.filter((c) => {
      const title = String(
        c.title || ""
      ).toLowerCase();

      return title.includes(
        String(
          person.fullName || ""
        ).toLowerCase()
      );
    });

  if (!related.length) {
    return {
      score: 20,
      status: "Dormant"
    };
  }

  const twoWay =
    related.filter(
      (c) =>
        c.status === "Two-way"
    ).length;

  const score = Math.min(
    100,
    30 +
      twoWay * 20 +
      related.length * 10
  );

  return {
    score,
    status:
      score > 75
        ? "Healthy"
        : score > 50
        ? "Warm"
        : "Dormant"
  };
}