import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import Preferences from "../../components/Preferences";

const mockPreferences = {
  costEfficiency: 0.5,
  timeEfficiency: 0.75,
};

describe("Preferences component", () => {
  it("renders correctly with initial preferences", () => {
    const onPreferenceChangeMock = vi.fn();
    const onResetPreferencesMock = vi.fn();

    render(
      <Preferences
        preferences={mockPreferences}
        onPreferenceChange={onPreferenceChangeMock}
        onResetPreferences={onResetPreferencesMock}
      />,
    );

    expect(screen.getByText("Configure Your Preferences")).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Cost Efficiency/i }),
    ).toHaveValue(String(mockPreferences.costEfficiency));
    expect(
      screen.getByRole("slider", { name: /Time Efficiency/i }),
    ).toHaveValue(String(mockPreferences.timeEfficiency));
  });

  it("calls onPreferenceChange when a slider is adjusted", () => {
    const onPreferenceChangeMock = vi.fn();
    const onResetPreferencesMock = vi.fn();

    render(
      <Preferences
        preferences={mockPreferences}
        onPreferenceChange={onPreferenceChangeMock}
        onResetPreferences={onResetPreferencesMock}
      />,
    );

    const slider = screen.getByRole("slider", { name: /Cost Efficiency/i });
    fireEvent.change(slider, { target: { value: 0.6 } });

    expect(onPreferenceChangeMock).toHaveBeenCalledWith("costEfficiency", 0.6);
  });

  it("calls onResetPreferences when reset button is clicked", () => {
    const onPreferenceChangeMock = vi.fn();
    const onResetPreferencesMock = vi.fn();

    render(
      <Preferences
        preferences={mockPreferences}
        onPreferenceChange={onPreferenceChangeMock}
        onResetPreferences={onResetPreferencesMock}
      />,
    );

    const resetButton = screen.getByRole("button", {
      name: /Reset Preferences/i,
    });
    fireEvent.click(resetButton);

    expect(onResetPreferencesMock).toHaveBeenCalled();
  });
});
