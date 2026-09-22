import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ReservationsPage from "./page";

describe("ReservationsPage", () => {
  it("shows upcoming reservations by default and allows viewing every state", async () => {
    const user = userEvent.setup();
    render(<ReservationsPage />);

    expect(screen.getByRole("heading", { name: "Club Terravalle" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Club Rancho San Francisco" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Anteriores 1/ }));
    expect(screen.getByRole("heading", { name: "Club Rancho San Francisco" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Canceladas 1/ }));
    expect(screen.getByRole("heading", { name: "Club Terravalle" })).toBeInTheDocument();
    expect(screen.getByText("Cancelada")).toBeInTheDocument();
  });

  it("moves a future reservation to cancelled after cancelling it", async () => {
    const user = userEvent.setup();
    render(<ReservationsPage />);

    await user.click(screen.getAllByRole("button", { name: "Cancelar" })[0]);

    expect(screen.getByRole("status")).toHaveTextContent("Reserva cancelada");
    await user.click(screen.getByRole("tab", { name: /Canceladas 2/ }));
    expect(screen.getAllByText("Cancelada")).toHaveLength(2);
  });
});
