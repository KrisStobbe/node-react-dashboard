import { renderHook } from "@testing-library/react";
import { useProviders } from "../../hooks/useProviders";
import { fetchProvidersByJobId } from "../../services/apiService";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mockPreferences } from "../mocks";

vi.mock("../../services/apiService", () => ({
  fetchProvidersByJobId: vi.fn(),
}));

vi.mock("lodash", () => ({
  ...vi.importActual("lodash"),
  debounce: (fn: any) => fn,
}));

describe("useProviders", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("initially sets providers to an empty array", async () => {
    const selectedJobId = "job123";

    vi.mocked(fetchProvidersByJobId).mockResolvedValueOnce([]);

    const { result } = renderHook(() =>
      useProviders(selectedJobId, mockPreferences),
    );

    vi.runAllTimers();
    expect(result.current.providers).toEqual([]);
  });

  it("handles errors when fetching providers", async () => {
    const selectedJobId = "job123";
    vi.mocked(fetchProvidersByJobId).mockRejectedValueOnce(
      new Error("Failed to fetch"),
    );

    const { result } = renderHook(() =>
      useProviders(selectedJobId, mockPreferences),
    );

    vi.runAllTimers();
    expect(result.current.providers).toEqual([]);
  });
});
