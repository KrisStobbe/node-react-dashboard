import { renderHook, waitFor } from "@testing-library/react";
import { useJobs } from "../../hooks/useJobs";
import { fetchJobs } from "../../services/apiService";
import { describe, expect, it, vi } from "vitest";
import { mockJobs } from "../mocks";

vi.mock("../../services/apiService", () => ({
  fetchJobs: vi.fn(),
}));

describe("useJobs", () => {
  it("initially sets jobs to an empty array", async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useJobs());

    await waitFor(() => expect(result.current.jobs).toEqual([]));
  });

  it("updates jobs after fetching from the API", async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce(mockJobs);

    const { result } = renderHook(() => useJobs());

    await waitFor(() => expect(result.current.jobs).toEqual(mockJobs));
  });

  it("handles errors when fetching jobs", async () => {
    vi.mocked(fetchJobs).mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result } = renderHook(() => useJobs());

    await waitFor(() => expect(result.current.jobs).toEqual([]));
  });
});
