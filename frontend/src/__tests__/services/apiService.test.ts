import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchJobs, fetchProvidersByJobId } from "../../services/apiService";
import { Provider } from "../../types";
import { mockJobs, mockProvider, mockPreferences } from "../mocks";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("apiService", () => {
  const mockProviders: Provider[] = [mockProvider];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("fetchJobs", () => {
    it("should fetch jobs correctly", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockJobs });

      const result = await fetchJobs();

      expect(result).toEqual(mockJobs);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL || ""}/jobs`,
      );
    });

    it("should handle errors while fetching jobs", async () => {
      const errorMessage = "Failed to fetch jobs";
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(fetchJobs()).rejects.toThrow(errorMessage);
    });
  });

  describe("fetchProvidersByJobId", () => {
    const jobId = "1";
    const stringifiedPreferences = Object.fromEntries(
      Object.entries(mockPreferences).map(([key, value]) => [
        key,
        String(value),
      ]),
    );
    const params = new URLSearchParams(stringifiedPreferences).toString();

    it("should fetch providers by job ID correctly", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockProviders });

      const result = await fetchProvidersByJobId(jobId, mockPreferences);

      expect(result).toEqual(mockProviders);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL || ""}/jobs/${jobId}/providers?${params}`,
      );
    });

    it("should handle errors while fetching providers", async () => {
      const errorMessage = "Failed to fetch providers";
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(
        fetchProvidersByJobId(jobId, mockPreferences),
      ).rejects.toThrow(errorMessage);
    });
  });
});
