import { describe, it, expect } from "vitest";
import { mockJob, mockProvider } from "../mocks";
import {
  haversineDistance,
  calculateMaxDistance,
} from "../../utils/distanceCalculation";

describe("distanceCalculation", () => {
  describe("haversineDistance", () => {
    it("should calculate the correct distance between two points", () => {
      const coords1 = { lat: 34.0522, lon: -118.2437 }; // Los Angeles
      const coords2 = { lat: 40.7128, lon: -74.006 }; // New York

      const distance = haversineDistance(coords1, coords2);
      expect(distance).toBeCloseTo(2445.55, 0); // Confirmed this with https://www.movable-type.co.uk/scripts/latlong.html
    });

    it("should return zero if the coordinates are the same", () => {
      const distance = haversineDistance(
        {
          lat: parseFloat(mockJob.latitude),
          lon: parseFloat(mockJob.longitude),
        },
        {
          lat: parseFloat(mockJob.latitude),
          lon: parseFloat(mockJob.longitude),
        },
      );
      expect(distance).toBe(0);
    });
  });

  describe("calculateMaxDistance", () => {
    it("should calculate the maximum distance between jobs and providers", () => {
      const jobs = [
        { ...mockJob, latitude: "37.7749", longitude: "-122.4194" },
      ]; // San Francisco
      const providers = [
        { ...mockProvider, latitude: "25.7617", longitude: "-80.1918" },
      ]; // Miami

      const maxDistance = calculateMaxDistance(jobs, providers);
      expect(maxDistance).toBeCloseTo(2590.97, 0); // Confirmed this with https://www.movable-type.co.uk/scripts/latlong.html
    });

    it("should handle cases with no jobs or no providers", () => {
      const jobs: any = [];
      const providers = [{ ...mockProvider }];

      const maxDistance = calculateMaxDistance(jobs, providers);
      expect(maxDistance).toBe(0);

      const moreJobs = [{ ...mockJob }];
      const noProviders: any = [];

      const maxDistanceNoProviders = calculateMaxDistance(
        moreJobs,
        noProviders,
      );
      expect(maxDistanceNoProviders).toBe(0);
    });

    it("should handle cases where jobs or providers lack coordinates", () => {
      const jobsWithNoCoords = [{ ...mockJob, latitude: "", longitude: "" }];
      const providersWithNoCoords = [
        { ...mockProvider, latitude: "", longitude: "" },
      ];

      const maxDistance = calculateMaxDistance(
        jobsWithNoCoords,
        providersWithNoCoords,
      );
      expect(maxDistance).toBe(0);
    });
  });
});
