import { Job, JobStatus, Provider } from "../models";
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";

const DATA_DIR = path.resolve(__dirname, "../../data");

/**
 * Reads a CSV file and processes each row with a given handler.
 * @param filePath The path to the CSV file.
 * @param dataHandler A function to process each row of the CSV.
 * @returns A promise that resolves to an array of processed data.
 */
export function readCSV<T>(
  filePath: string,
  dataHandler: (data: any) => T,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(dataHandler(data)))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

/**
 * Processes job data from a CSV row into a Job object.
 * @param data A row from the CSV file.
 * @returns A Job object.
 */
export function processJobData(data: any): Job {
  return {
    ...data,
    datetime: new Date(data.datetime),
    materials_turned_in_at: data.materials_turned_in_at
      ? new Date(data.materials_turned_in_at)
      : null,
    avg_cost_per_page: parseFloat(data.avg_cost_per_page),
    provider_rating: data.provider_rating
      ? parseFloat(data.provider_rating)
      : 0,
  };
}

/**
 * Loads job data from a CSV file.
 * @returns A promise that resolves to an array of Job objects.
 */
export const loadJobs = async (): Promise<Job[]> => {
  return readCSV<Job>(`${DATA_DIR}/jobs.csv`, processJobData);
};

/**
 * Processes provider data from a CSV row into a Provider object.
 * @param data A row from the CSV file.
 * @returns A Provider object.
 */
export function processProviderData(data: any): Provider {
  return {
    ...data,
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    averageCostScore: 0,
    averageRatingScore: 0,
    averageTurnoverTimeScore: 0,
  };
}

/**
 * Loads provider data from a CSV file.
 * @returns A promise that resolves to an array of Provider objects.
 */
export const loadProviders = async (): Promise<Provider[]> => {
  return readCSV<Provider>(`${DATA_DIR}/providers.csv`, processProviderData);
};

/**
 * Calculates the average of an array of numbers.
 * @param values An array of numbers.
 * @returns The average of the numbers.
 */
function calculateAverage(values: number[]): number {
  return values.length === 0
    ? 0
    : values.reduce((acc, val) => acc + val, 0) / values.length;
}

/**
 * Loads providers with calculated metrics based on job data.
 * @returns A promise that resolves to an array of Provider objects with metrics.
 */
export const loadProvidersWithMetrics = async (): Promise<Provider[]> => {
  const jobs = await loadJobs();
  const providers = await loadProviders();

  providers.forEach((provider) => {
    const providerJobs = jobs.filter(
      (job) =>
        job.provider_id === provider.id && job.status === JobStatus.COMPLETE,
    );
    if (providerJobs.length > 0) {
      provider.averageCostScore =
        1 -
        calculateAverage(
          providerJobs.map((job) => parseFloat(job.avg_cost_per_page)),
        );
      provider.averageRatingScore = calculateAverage(
        providerJobs.map((job) => parseFloat(job.provider_rating)),
      );
      provider.averageTurnoverTimeScore = calculateAverage(
        providerJobs.map((job) => {
          const materialsTurnedInAt = job.materials_turned_in_at
            ? new Date(job.materials_turned_in_at)
            : null;
          const jobStartDate = new Date(job.datetime);
          const turnoverTime =
            materialsTurnedInAt && jobStartDate
              ? (materialsTurnedInAt.getTime() - jobStartDate.getTime()) /
                3600000
              : 0;
          return turnoverTime > 0 ? 1 / turnoverTime : 0;
        }),
      );
    }
  });

  return normalizeProviders(providers, jobs);
};

/**
 * Normalizes provider metrics.
 * @param providers An array of providers.
 * @param jobs An array of jobs.
 * @returns An array of providers with normalized metrics.
 */
export function normalizeProviders(
  providers: Provider[],
  jobs: Job[],
): Provider[] {
  const normalizedCosts = normalizeMetrics(
    providers,
    jobs,
    (p) => p.averageCostScore,
  );
  const normalizedTurnoverTimes = normalizeMetrics(
    providers,
    jobs,
    (p) => p.averageTurnoverTimeScore,
  );

  return providers.map((provider, index) => ({
    ...provider,
    averageCostScore: normalizedCosts[index],
    averageRatingScore: provider.averageRatingScore,
    averageTurnoverTimeScore: normalizedTurnoverTimes[index],
  }));
}

/**
 * Normalizes a specific metric across providers.
 * @param providers An array of providers.
 * @param jobs An array of jobs.
 * @param metricExtractor A function to extract the metric from a provider.
 * @returns An array of normalized metric values.
 */
export function normalizeMetrics(
  providers: Provider[],
  jobs: Job[],
  metricExtractor: (provider: Provider) => number,
): number[] {
  // Initialize normalized values for all providers with 0
  const normalizedValues = new Array(providers.length).fill(0);

  // Filter providers who have completed jobs
  const providersWithJobs = providers.filter((provider, index) => {
    const providerJobs = jobs.filter(
      (job) =>
        job.provider_id === provider.id && job.status === JobStatus.COMPLETE,
    );
    return providerJobs.length > 0;
  });

  // Check if any provider has completed jobs to normalize their scores
  if (providersWithJobs.length > 0) {
    const values = providersWithJobs.map(metricExtractor);
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Normalize values for providers with jobs
    providersWithJobs.forEach((provider, index) => {
      const value = values[index];
      const normalizedScore =
        max === min ? (max === 0 ? 0 : 1) : (value - min) / (max - min);
      // Update the normalized score in the original array of providers
      const providerIndex = providers.indexOf(provider);
      normalizedValues[providerIndex] = normalizedScore;
    });
  }

  return normalizedValues;
}
