import { useState, useEffect } from "react";
import { fetchProvidersByJobId } from "../services/apiService";
import { Provider } from "../types";
import { debounce } from "lodash";

/**
 * Custom hook to fetch and manage a list of providers based on a selected job ID and user preferences.
 * Utilizes debouncing to limit API requests during rapid input changes.
 *
 * @param selectedJobId - The ID of the job for which providers are to be fetched.
 * @param preferences - User preferences that may affect provider selection.
 * @returns An object containing the current list of providers.
 */
export const useProviders = (
  selectedJobId: string | null,
  preferences: any,
) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const DEBOUNCE_DELAY = 50;

  useEffect(() => {
    /**
     * Debounced function to fetch providers, which helps in reducing the number
     * of API calls made when the preferences change rapidly.
     */
    const debouncedFetchProviders = debounce(async () => {
      if (selectedJobId) {
        try {
          const fetchedProviders = await fetchProvidersByJobId(
            selectedJobId,
            preferences,
          );
          setProviders(fetchedProviders);
        } catch (error) {
          console.error("Error fetching providers:", error);
        }
      }
    }, DEBOUNCE_DELAY);

    debouncedFetchProviders();
  }, [selectedJobId, preferences]);

  return { providers };
};
