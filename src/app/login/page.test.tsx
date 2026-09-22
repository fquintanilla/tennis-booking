import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

const signInWithOAuth = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { signInWithOAuth } }),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    signInWithOAuth.mockReset();
  });

  it("starts the Google OAuth flow", async () => {
    signInWithOAuth.mockResolvedValue({ error: null });
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    await waitFor(() => expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    }));
    expect(screen.getByRole("button", { name: "Redirigiendo a Google..." })).toBeDisabled();
  });

  it("shows an error when Google sign-in cannot start", async () => {
    signInWithOAuth.mockResolvedValue({ error: new Error("OAuth unavailable") });
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: "Continuar con Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos iniciar sesión con Google");
    expect(screen.getByRole("button", { name: "Continuar con Google" })).toBeEnabled();
  });
});
