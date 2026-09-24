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
- Keep Supabase queries in `src/data-access` modules. Server Components,
  Server Actions, and Route Handlers should use those modules instead of
  querying Supabase directly.
- Use the centralized `logger` from `@/lib/observability/logger` for
  application logging. Log structured, non-sensitive context; keep provider
  integrations in that module so observability tooling can be added without
  changing callers.

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
- Update `MVP_PROJECT_SCOPE.md` when an approved architectural decision
  materially changes the documented scope.
