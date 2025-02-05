export const Ranks = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger"
]

export function divisionToNumber(division: string): number {
  const transformed = division.toLowerCase();
  switch (transformed) {
    case "i":
      return 1;
    case "ii":
      return 2;
    case "iii":
      return 3;
    case "iv":
      return 4;
  }

  return 0;
}

export function rankToLP(rank: string, division: string, lp: number): number {
  const index = Ranks.findIndex(r => r.toLowerCase() === rank.toLowerCase());
  const previousRanks = index * 400;
  const divisionLP = ((4 - divisionToNumber(division)) * 100) + lp;

  return previousRanks + divisionLP;
}