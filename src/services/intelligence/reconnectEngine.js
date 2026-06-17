import {
  buildPersonScore
} from "./personScore";

export function getReconnectCandidates(
  connections
) {
  return connections
    .map((person) => ({
      person,
      score:
        buildPersonScore(
          person
        ).opportunity
    }))
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 10);
}