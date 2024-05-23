import { Job, JobLocation, Provider, Preferences } from "../models";
import {
  calculateMaxDistance,
  haversineDistance,
} from "../utils/distanceCalculation";
import { loadJobs, loadProvidersWithMetrics } from "./csvLoader";

/**
 * Initializes jobs and providers by loading them from storage and checking the maximum distance for normalization
 * purposes.
 * @returns A promise that resolves to an object containing arrays of jobs and providers, and the maximum distance.
 */
export async function initializeJobsAndProviders(): Promise<{
  jobs: Job[];
  providers: Provider[];
  maxDistance: number;
}> {
  const jobs = await loadJobs();
  const providers = await loadProvidersWithMetrics();
  const maxDistance = calculateMaxDistance(jobs, providers);
  return { jobs, providers, maxDistance };
}

/**
 * Retrieves all jobs from the storage.
 * @returns A promise that resolves to an array of Job objects.
 */
export async function getJobs(): Promise<Job[]> {
  const { jobs } = await initializeJobsAndProviders();
  return jobs;
}

/**
 * Calculates the match score between a job and a provider based on various preferences.
 * @param job - The job for which the match score is being calculated.
 * @param provider - The provider for whom the match score is being calculated.
 * @param preferences - The preferences used to weigh different scoring metrics.
 * @param maxDistance - The maximum distance used for normalizing the distance score.
 * @returns The total match score as a number.
 */
export function calculateMatchScore(
  job: Job,
  provider: Provider,
  preferences: Preferences,
  maxDistance: number,
): number {
  // Normalize cost, rating, and turnover time scores based on provider metrics
  const normalizedCostScore = provider.averageCostScore || 0;
  const normalizedRatingScore = provider.averageRatingScore || 0;
  const normalizedTurnoverTimeScore = provider.averageTurnoverTimeScore || 0;

  // Calculate distance score only if the job is location-based and provider has valid coordinates
  let normalizedDistanceScore = 0;
  if (
    job.location_type === JobLocation.LOCATION_BASED &&
    provider.latitude &&
    provider.longitude
  ) {
    const distance =
      parseFloat(job.latitude) &&
      parseFloat(job.longitude) &&
      parseFloat(provider.latitude) &&
      parseFloat(provider.longitude)
        ? haversineDistance(
            { lat: parseFloat(job.latitude), lon: parseFloat(job.longitude) },
            {
              lat: parseFloat(provider.latitude),
              lon: parseFloat(provider.longitude),
            },
          )
        : 0;
    normalizedDistanceScore =
      maxDistance > 0 ? (maxDistance - distance) / maxDistance : 0;
  }

  // Calculate the total score by applying weights from preferences
  const costScore = normalizedCostScore * preferences.costWeight;
  const ratingScore = normalizedRatingScore * preferences.ratingWeight;
  const turnoverScore =
    normalizedTurnoverTimeScore * preferences.turnoverWeight;
  const proximityScore = normalizedDistanceScore * preferences.proximityWeight;
  const totalScore = costScore + ratingScore + turnoverScore + proximityScore;

  return totalScore;
}

/**
 * Retrieves a list of providers for a specific job, sorted by their match score.
 * @param jobId - The ID of the job for which providers are being retrieved.
 * @param preferences - The preferences to weigh different provider metrics.
 * @returns A promise that resolves to an array of providers, each with an added totalScore property.
 */
export async function getProvidersForJob(
  jobId: string,
  preferences: Preferences,
): Promise<Provider[]> {
  const { jobs, providers, maxDistance } = await initializeJobsAndProviders();
  const job = jobs.find((job) => job.id === jobId);
  if (!job) {
    return [];
  }

  // Calculate match score for each provider, add it to the provider object, and sort by score
  return providers
    .map((provider) => {
      const totalScore = calculateMatchScore(
        job,
        provider,
        preferences,
        maxDistance,
      );
      return { ...provider, totalScore };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}
