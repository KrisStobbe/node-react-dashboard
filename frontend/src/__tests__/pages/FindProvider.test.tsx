import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import FindProvider from "../../pages/FindProvider";
import { describe, it, expect, vi } from "vitest";
import { mockJobs, mockProvider } from "../mocks";

vi.mock("../../hooks/useJobs", () => ({
  useJobs: () => ({
    jobs: mockJobs,
  }),
}));

vi.mock("../../hooks/useProviders", () => ({
  useProviders: () => ({
    providers: [mockProvider],
  }),
}));

describe("FindProvider component", () => {
  it("renders the FindProvider container", () => {
    const { getByTestId } = render(<FindProvider />);
    expect(getByTestId("find-provider")).toBeInTheDocument();
  });

  it("renders the job selection section", () => {
    const { getByTestId } = render(<FindProvider />);
    expect(getByTestId("job-selection-section")).toBeInTheDocument();
  });

  it("renders the provider list section", () => {
    const { getByTestId } = render(<FindProvider />);
    expect(getByTestId("provider-list-section")).toBeInTheDocument();
  });

  it("renders the preferences section", () => {
    const { getByTestId } = render(<FindProvider />);
    expect(getByTestId("preferences-section")).toBeInTheDocument();
  });
});
