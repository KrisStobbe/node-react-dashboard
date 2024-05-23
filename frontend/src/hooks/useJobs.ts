import { useState, useEffect } from "react";
import { fetchJobs } from "../services/apiService";
import { Job } from "../types";

/**
 * Custom hook to fetch and manage a list of jobs.
 * It provides state and operations related to fetching jobs from the Express API.
 *
 * @returns An object containing the current list of jobs.
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const fetchedJobs = await fetchJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    loadJobs();
  }, []);

  return { jobs };
};
