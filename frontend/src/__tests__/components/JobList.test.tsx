import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import JobList from "../../components/JobList";
import { mockJobs } from "../mocks";

describe("JobList component", () => {
  it("renders correctly with jobs", () => {
    const onSelectMock = vi.fn();
    render(
      <JobList jobs={mockJobs} selectedJobId="1" onSelect={onSelectMock} />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(mockJobs.length + 1);
    expect(
      screen.getByText(new Date(mockJobs[0].datetime).toLocaleString()),
    ).toBeInTheDocument();
    expect(screen.getByText("Location_based")).toBeInTheDocument();
  });

  it("handles row click correctly", () => {
    const onSelectMock = vi.fn();
    render(
      <JobList jobs={mockJobs} selectedJobId={null} onSelect={onSelectMock} />,
    );
    fireEvent.click(screen.getAllByRole("row")[1]);
    expect(onSelectMock).toHaveBeenCalledWith(mockJobs[0].id);
  });

  it("displays the correct icon for selected job", () => {
    const onSelectMock = vi.fn();
    render(
      <JobList jobs={mockJobs} selectedJobId="1" onSelect={onSelectMock} />,
    );
    const selectedJobRow = screen.getAllByRole("row")[1];
    expect(selectedJobRow.querySelector("svg")).toHaveAttribute(
      "data-testid",
      "WorkIcon",
    );
  });
});
