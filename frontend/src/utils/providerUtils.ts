import { Provider } from "../types";

/**
 * Sorts an array of providers by their total score in descending order.
 * @param providers An array of Provider objects to be sorted.
 * @returns A new array of Provider objects sorted by total score.
 */
export const sortProvidersByScore = (providers: Provider[]): Provider[] => {
  return [...providers].sort((a, b) => b.totalScore - a.totalScore);
};

/**
 * Calculates the rank of a provider based on their position in a sorted list.
 * This function accounts for ties by assigning the same rank to providers with the same score.
 * @param providers An array of Provider objects, assumed to be sorted by score.
 * @param index The current index of the provider whose rank is being calculated.
 * @returns The rank of the provider at the given index.
 */
export const calculateRank = (providers: Provider[], index: number): number => {
  if (index === 0) return 1; // The first provider is always ranked first.

  const previousScore = providers[index - 1].totalScore; // Score of the provider just above in the list.
  const currentScore = providers[index].totalScore; // Score of the current provider.

  // If the current provider has the same score as the previous one, they share the same rank.
  return previousScore === currentScore
    ? calculateRank(providers, index - 1)
    : index + 1; // Otherwise, rank is index + 1 (1-based index).
};
