import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProviderList from "../../components/ProviderList";

vi.mock("../utils/providerUtils", () => ({
  sortProvidersByScore: (providers: any) =>
    providers.sort((a: any, b: any) => b.totalScore - a.totalScore),
  calculateRank: (_: any, index: any) => index + 1,
}));

const mockProviders = [
  {
    id: "1",
    full_name: "Provider One",
    latitude: 34.05,
    longitude: -118.25,
    averageCostScore: 0.8,
    averageRatingScore: 0.9,
    averageTurnoverTimeScore: 0.85,
    totalScore: 0.85,
  },
  {
    id: "2",
    full_name: "Provider Two",
    latitude: 36.77,
    longitude: -119.41,
    averageCostScore: 0.7,
    averageRatingScore: 0.8,
    averageTurnoverTimeScore: 0.75,
    totalScore: 0.75,
  },
  {
    id: "3",
    full_name: "Provider Three",
    latitude: 36.77,
    longitude: -119.41,
    averageCostScore: 0.6,
    averageRatingScore: 0.7,
    averageTurnoverTimeScore: 0.65,
    totalScore: 0.65,
  },
];

describe("ProviderList component", () => {
  it("renders correctly with sorted providers", () => {
    render(<ProviderList providers={mockProviders} />);

    expect(screen.getByRole("table")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(4); // Including header row
    expect(screen.getAllByRole("cell", { name: /Provider One/ })).toHaveLength(
      1,
    );
    expect(screen.getAllByRole("cell", { name: /0.850/ })).toHaveLength(1);
  });

  it("displays trophy icons for top 3 providers", () => {
    render(<ProviderList providers={mockProviders} />);

    const trophies = screen.getAllByTestId("EmojiEventsIcon");
    expect(trophies).toHaveLength(3); // Only top 3 should have trophies
    expect(trophies[0]).toHaveStyle("color: rgb(255, 215, 0)"); // Gold
    expect(trophies[1]).toHaveStyle("color: rgb(192, 192, 192)"); // Silver
    expect(trophies[2]).toHaveStyle("color: #cd7f32"); // Bronze
  });
});
