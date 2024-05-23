import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../components/Header";

describe("Header component", () => {
  it("renders correctly", () => {
    render(<Header />, { wrapper: MemoryRouter });
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByAltText("Steno Logo")).toBeInTheDocument();
    expect(
      screen.getByText("Steno Job & Provider Ranking Analysis"),
    ).toBeInTheDocument();
    expect(screen.getByText("By Kristoffer Stobbe")).toBeInTheDocument();
  });
});
