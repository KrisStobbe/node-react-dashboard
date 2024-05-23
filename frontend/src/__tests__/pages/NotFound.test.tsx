import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import NotFound from "../../pages/NotFound";
import { describe, it, expect } from "vitest";

describe("NotFound component", () => {
  it("renders the NotFound container", () => {
    const { getByTestId } = render(<NotFound />);
    expect(getByTestId("not-found")).toBeInTheDocument();
  });
});
