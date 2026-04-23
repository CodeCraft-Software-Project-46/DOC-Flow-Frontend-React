import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi } from "vitest";
import { WorkingHoursModal } from "../WorkingHoursModal";

describe("WorkingHoursModal", () => {

  test("renders modal title", () => {
    render(
      <WorkingHoursModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        saving={false}
      />
    );

    expect(
      screen.getByText("Working Hours Configuration")
    ).toBeInTheDocument();
  });

  test("calls onSave when clicking save (valid case)", () => {
    const mockSave = vi.fn();

    render(
      <WorkingHoursModal
        isOpen={true}
        onClose={() => {}}
        onSave={mockSave}
        saving={false}
      />
    );

    const saveBtn = screen.getByText("Save Configuration");

    fireEvent.click(saveBtn);

    expect(mockSave).toHaveBeenCalled();
  });

  test("shows error when all working days are removed", () => {
  render(
    <WorkingHoursModal
      isOpen={true}
      onClose={() => {}}
      onSave={() => {}}
      saving={false}
    />
  );

  // remove all working days (click all day buttons)
  const dayButtons = screen.getAllByRole("button");

  dayButtons.forEach(btn => {
    if (btn.textContent?.length === 3) {
      fireEvent.click(btn);
    }
  });

  fireEvent.click(screen.getByText("Save Configuration"));

  expect(
    screen.getByText(/working day/i)
  ).toBeInTheDocument();
});

test("adds a holiday successfully", () => {
  render(
    <WorkingHoursModal
      isOpen={true}
      onClose={() => {}}
      onSave={() => {}}
      saving={false}
    />
  );

  const input = screen.getByLabelText("Holiday date");
  const addBtn = screen.getByText("Add");

  fireEvent.change(input, { target: { value: "2026-10-10" } });
  fireEvent.click(addBtn);

  expect(screen.getByText("2026-10-10")).toBeInTheDocument();
});

test("calls onClose when cancel is clicked", () => {
  const mockClose = vi.fn();

  render(
    <WorkingHoursModal
      isOpen={true}
      onClose={mockClose}
      onSave={() => {}}
      saving={false}
    />
  );

  fireEvent.click(screen.getByText("Cancel"));

  expect(mockClose).toHaveBeenCalled();
});
  

});