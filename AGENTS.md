# Tennis Court Booking Platform

## Project context

Read `MVP_PROJECT_SCOPE.md` before making architectural or product
decisions. The MVP validates a fast, mobile-first experience for
discovering and reserving tennis courts in Quito, Ecuador.

Prioritize simplicity, reliability, low operating cost, and learning
from real users. Do not add out-of-scope functionality without explicit
approval.

## Technical conventions

- Use Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.
- Use Supabase PostgreSQL, Auth, Storage, and Row Level Security (RLS).
- Use `@supabase/ssr` for cookie-based SSR sessions and the PKCE OAuth
  flow.
- Use Axios and TanStack Query (React Query) for client-side HTTP data
  fetching, caching, and mutation state.
- Use React Hook Form, Zod, and `@hookform/resolvers` for complex client
  forms. Prefer native forms and Server Actions for simple mutations.
- Keep client-side validation for user experience only; validate all
  mutations on the server.

## Reservation integrity and security

- PostgreSQL is the final source of truth for availability.
- Enforce non-overlapping active reservations for each court in the
  database. Never rely on client-side slot checks to prevent conflicts.
- Enforce authorization in RLS policies and server-side code. Hidden UI
  elements are never an authorization boundary.
- Do not expose Supabase service-role credentials to the browser or
  commit secrets, environment files, or production data.

## Scope guardrails

- Online payments, native mobile applications, notifications, rankings,
  and multi-sport support are out of scope for MVP v1.
- Design reservation and payment data so payments can be added later,
  but do not implement payment workflows now.
- Keep the booking flow responsive and mobile-first.

## Working agreements

- Preserve existing user changes and avoid unrelated refactors.
- Delegate Playwright end-to-end test implementation to the
  `playwright-e2e-writer` custom agent defined in
  `.codex/agents/playwright-e2e-writer.toml`.
- Update `MVP_PROJECT_SCOPE.md` when an approved architectural decision
  materially changes the documented scope.
- Add or update focused tests when application code and test tooling are
  present; run the relevant checks before completing an implementation.

## Component tests

- Use Vitest and React Testing Library for component tests.
- Co-locate each component test with its component and name it
  `ComponentName.test.tsx`.
- Use the shared `renderWithQuery` helper for components that use
  TanStack Query; keep the helper's QueryClient isolated per test.
- Test observable user behavior with accessible queries: rendering,
  interactions, validation messages, loading states, and error states.
- Mock network and Supabase boundaries, not component internals. Mock
  Axios with Vitest's `vi.mock("axios")`; avoid snapshot-only tests.
- Run the affected component tests after changes. Run the full component
  test suite when shared components, providers, or test configuration
  change.
- Keep Playwright work limited to end-to-end coverage and delegate its
  implementation as required above.
