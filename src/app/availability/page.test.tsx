import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import AvailabilityPage from "./page";

describe("AvailabilityPage", () => {
  it("enables continuing only after a player selects an available time", async () => {
    const user = userEvent.setup();
    render(<AvailabilityPage />);

    expect(screen.getByRole("button", { name: "Continuar con la reserva" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "07:00, disponible" }));

    const continueLink = screen.getByRole("link", { name: "Continuar con la reserva" });
    expect(continueLink).toHaveAttribute(
      "href",
      "/reservation/confirm?court=court-1&date=2026-09-22&time=07:00&duration=1",
    );
  });
});
