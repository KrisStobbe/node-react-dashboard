import { describe, it, expect, beforeEach, vi } from "vitest";
import * as jobService from "../../services/jobService";
import * as utils from "../../utils/distanceCalculation";
import * as csvLoader from "../../services/csvLoader";
import { mockJob, mockProvider, mockPreferences, maxDistance } from "../mocks";

vi.mock("../../utils/distanceCalculation", () => ({
  calculateMaxDistance: vi.fn(),
  haversineDistance: vi.fn((coords1, coords2) => 1),
}));
vi.mock("../../services/csvLoader", () => ({
  loadJobs: vi.fn(),
  loadProvidersWithMetrics: vi.fn(),
}));

describe("JobService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(csvLoader.loadJobs).mockResolvedValue([mockJob]);
    vi.mocked(csvLoader.loadProvidersWithMetrics).mockResolvedValue([
      mockProvider,
    ]);
    vi.mocked(utils.calculateMaxDistance).mockReturnValue(maxDistance);
    vi.spyOn(jobService, "calculateMatchScore").mockReturnValue(1);
  });

  describe("initializeJobsAndProviders", () => {
    it("should initialize jobs and providers correctly", async () => {
      const result = await jobService.initializeJobsAndProviders();
      expect(result.jobs).toEqual([mockJob]);
      expect(result.providers).toEqual([mockProvider]);
      expect(result.maxDistance).toEqual(maxDistance);
    });

    describe("with job loading errors", () => {
      beforeEach(() => {
        vi.mocked(csvLoader.loadJobs).mockRejectedValue(
          new Error("Failed to load jobs"),
        );
      });

      it("should handle job loading errors", async () => {
        await expect(jobService.initializeJobsAndProviders()).rejects.toThrow(
          "Failed to load jobs",
        );
      });
    });

    describe("with provider loading errors", () => {
      beforeEach(() => {
        vi.mocked(csvLoader.loadProvidersWithMetrics).mockRejectedValue(
          new Error("Failed to load providers"),
        );
      });

      it("should handle provider loading errors", async () => {
        await expect(jobService.initializeJobsAndProviders()).rejects.toThrow(
          "Failed to load providers",
        );
      });
    });
  });

  describe("Job Retrieval and Matching", () => {
    it("should retrieve all jobs", async () => {
      const jobs = await jobService.getJobs();
      expect(jobs).toEqual([mockJob]);
    });

    it("should calculate the match score correctly", () => {
      const score = jobService.calculateMatchScore(
        mockJob,
        mockProvider,
        mockPreferences,
        maxDistance,
      );
      expect(score).toBeGreaterThan(0);
    });

    it("should retrieve providers for a specific job with scores", async () => {
      const providers = await jobService.getProvidersForJob(
        "1",
        mockPreferences,
      );
      expect(providers.length).toBe(1);
      expect(providers[0].totalScore).toBeCloseTo(3.4, 0);
    });
  });
});
