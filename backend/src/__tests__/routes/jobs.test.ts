import { describe, it, expect, beforeEach, vi } from "vitest";
import supertest from "supertest";
import { createServer } from "http";
import express from "express";
import router from "../../routes/jobs";
import * as jobService from "../../services/jobService";
import { mockJob, mockProvider } from "../mocks";

const app = express();
app.use(express.json());
app.use("/api", router);

const request = supertest(createServer(app));

describe("Jobs Routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /jobs", () => {
    it("should return all jobs", async () => {
      const mockJobs = [mockJob];
      vi.spyOn(jobService, "getJobs").mockResolvedValue(mockJobs);

      const response = await request.get("/api/jobs");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockJobs);
    });

    it("should handle errors when fetching jobs", async () => {
      vi.spyOn(jobService, "getJobs").mockRejectedValue(
        new Error("Failed to fetch jobs"),
      );

      const response = await request.get("/api/jobs");
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error fetching jobs");
    });
  });

  describe("GET /jobs/:jobId/providers", () => {
    it("should return providers for a specific job", async () => {
      const jobId = "123";
      const mockProviders = [mockProvider];
      vi.spyOn(jobService, "getProvidersForJob").mockResolvedValue(
        mockProviders,
      );

      const response = await request.get(`/api/jobs/${jobId}/providers`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProviders);
    });

    it("should handle errors when fetching providers", async () => {
      const jobId = "123";
      vi.spyOn(jobService, "getProvidersForJob").mockRejectedValue(
        new Error("Failed to fetch providers"),
      );

      const response = await request.get(`/api/jobs/${jobId}/providers`);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Error fetching providers",
      );
    });
  });
});
