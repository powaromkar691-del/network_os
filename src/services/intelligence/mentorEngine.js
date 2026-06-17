import { buildPersonScore } from "./personScore";

export function getTopMentors(connections) {
  return connections
    .map((person) => ({
      person,
      intelligence: buildPersonScore(person)
    }))
    .sort(
      (a, b) =>
        b.intelligence.mentor -
        a.intelligence.mentor
    )
    .slice(0, 25);
}