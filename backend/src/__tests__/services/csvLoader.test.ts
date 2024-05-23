import {
  readCSV,
  processJobData,
  processProviderData,
  loadJobs,
  loadProviders,
  normalizeProviders,
} from "../../services/csvLoader";
import { describe, it, expect, vi } from "vitest";
import fs from "fs";
import { JobStatus } from "../../models";
import { mockJob, mockProvider } from "../mocks";

vi.mock("fs");

describe("readCSV", () => {
  it("should read CSV data correctly and process each row", async () => {
    const mockReadStream: any = {
      pipe: vi.fn().mockReturnThis(),
      on: vi.fn((event, handler) => {
        if (event === "data") {
          handler({ some: "data" });
        } else if (event === "end") {
          handler();
        }
        return mockReadStream;
      }),
    };
    vi.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream as any);

    const results = await readCSV("fake_path.csv", (data) => data);
    expect(results).toEqual([{ some: "data" }]);
    expect(fs.createReadStream).toHaveBeenCalledWith("fake_path.csv");
  });

  it("should handle file not found error", async () => {
    const mockError = new Error("File not found");
    vi.spyOn(fs, "createReadStream").mockImplementation(() => {
      throw mockError;
    });

    await expect(
      readCSV("non_existent_file.csv", (data) => data),
    ).rejects.toThrow("File not found");
  });

  it("should handle stream errors correctly", async () => {
    const mockReadStream: any = {
      pipe: vi.fn().mockReturnThis(),
      on: vi.fn((event, handler) => {
        if (event === "error") {
          handler(new Error("Stream Error"));
        }
        return mockReadStream;
      }),
    };
    vi.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream);

    await expect(
      readCSV("path_with_error.csv", (data) => data),
    ).rejects.toThrow("Stream Error");
  });
});

describe("processJobData", () => {
  it("should correctly process and convert job data from CSV row", () => {
    const sampleData = {
      datetime: "2021-05-20T14:48:00.000Z",
      materials_turned_in_at: "2021-05-22T15:00:00.000Z",
      avg_cost_per_page: "0.05",
      provider_rating: "4.5",
    };
    const processed = processJobData(sampleData);
    expect(processed.datetime).toBeInstanceOf(Date);
    expect(processed.materials_turned_in_at).toBeInstanceOf(Date);
    expect(processed.avg_cost_per_page).toBe(0.05);
    expect(processed.provider_rating).toBe(4.5);
  });

  it("should handle incorrect data types for job data", () => {
    const sampleData = {
      datetime: "not-a-date",
      materials_turned_in_at: "also-not-a-date",
      avg_cost_per_page: "not-a-number",
      provider_rating: "not-a-number",
    };
    const processed = processJobData(sampleData);
    expect(processed.datetime.toString()).toBe("Invalid Date");
    expect(Number(processed.materials_turned_in_at)).toBeNaN();
    expect(Number(processed.avg_cost_per_page)).toBeNaN();
    expect(Number(processed.provider_rating)).toBeNaN();
  });

  it("should handle missing optional fields", () => {
    // materials_turned_in_at is missing
    const sampleData = {
      datetime: "2021-05-20T14:48:00.000Z",
      avg_cost_per_page: "0.05",
      provider_rating: "4.5",
    };
    const processed = processJobData(sampleData);
    expect(processed.materials_turned_in_at).toBeNull();
  });
});

describe("processProviderData", () => {
  it("should correctly convert provider data from CSV row", () => {
    const sampleData = {
      latitude: "34.0522",
      longitude: "-118.2437",
    };
    const processed = processProviderData(sampleData);
    expect(processed.latitude).toBe(34.0522);
    expect(processed.longitude).toBe(-118.2437);
  });
});

describe("loadJobs", () => {
  it("should handle malformed data gracefully", async () => {
    const mockReadStream: any = {
      pipe: vi.fn().mockReturnThis(),
      on: vi.fn((event, handler) => {
        if (event === "data") {
          handler({ datetime: "bad-date", avg_cost_per_page: "not-a-number" });
        } else if (event === "end") {
          handler();
        }
        return mockReadStream;
      }),
    };
    vi.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream as any);

    const results = await loadJobs();
    expect(Number(results[0].avg_cost_per_page)).toBeNaN();
    expect(results[0].datetime.toString()).toBe("Invalid Date");
  });
});

describe("loadProviders", () => {
  it("should return an empty array when no data is present in the CSV file", async () => {
    const mockReadStream: any = {
      pipe: vi.fn().mockReturnThis(),
      on: vi.fn((event, handler) => {
        if (event === "end") {
          handler();
        }
        return mockReadStream;
      }),
    };
    vi.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream as any);

    const results = await loadProviders();
    expect(results).toEqual([]);
  });
});

describe("normalizeProviders", () => {
  it("should normalize provider metrics correctly when jobs vary", () => {
    const providers = [
      { ...mockProvider, id: "1", averageCostScore: 1 },
      { ...mockProvider, id: "2", averageCostScore: 0 },
    ];
    const jobs = [
      { ...mockJob, provider_id: "1", status: JobStatus.COMPLETE },
      { ...mockJob, provider_id: "2", status: JobStatus.COMPLETE },
    ];

    const normalized = normalizeProviders(providers, jobs);
    expect(normalized[0].averageCostScore).toBeGreaterThan(
      normalized[1].averageCostScore,
    );
  });

  it("should correctly handle all zero or identical metrics", async () => {
    const providers = [
      { ...mockProvider, id: "1", averageCostScore: 0 },
      { ...mockProvider, id: "2", averageCostScore: 0 },
    ];
    const jobs = [
      {
        ...mockJob,
        provider_id: "1",
        status: JobStatus.COMPLETE,
        avg_cost_per_page: "0",
      },
      {
        ...mockJob,
        provider_id: "2",
        status: JobStatus.COMPLETE,
        avg_cost_per_page: "0",
      },
    ];

    const normalized = normalizeProviders(providers, jobs);
    normalized.forEach((provider) => {
      expect(provider.averageCostScore).toBe(0);
    });
  });

  it("should handle cases where no jobs are completed", () => {
    const providers = [
      { ...mockProvider, id: "1", averageCostScore: 0 },
      { ...mockProvider, id: "2", averageCostScore: 0 },
    ];
    const jobs = [
      { ...mockJob, provider_id: "1", status: JobStatus.SCHEDULED },
      { ...mockJob, provider_id: "2", status: JobStatus.SCHEDULED },
    ];

    const normalized = normalizeProviders(providers, jobs);
    expect(normalized[0].averageCostScore).toBe(0);
    expect(normalized[1].averageCostScore).toBe(0);
  });
});
