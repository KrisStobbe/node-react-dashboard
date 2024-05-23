import axios from "axios";
import { Job, Provider } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Fetches a list of jobs from the server.
 * @returns A promise that resolves to an array of Job objects.
 * @throws Will throw an error if the HTTP request fails.
 */
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get<Job[]>(`${API_BASE_URL}/jobs`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches a list of providers for a specific job ID, taking into account user preferences.
 * @param jobId The unique identifier for the job.
 * @param preferences An object containing key-value pairs of user preferences which affect provider selection.
 * @returns A promise that resolves to an array of Provider objects.
 * @throws Will throw an error if the HTTP request fails.
 */
export const fetchProvidersByJobId = async (
  jobId: string,
  preferences: { [key: string]: number },
): Promise<Provider[]> => {
  const params = new URLSearchParams(preferences as any).toString();
  try {
    const response = await axios.get<Provider[]>(
      `${API_BASE_URL}/jobs/${jobId}/providers?${params}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
