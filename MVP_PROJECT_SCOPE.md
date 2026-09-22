# Tennis Court Booking Platform --- MVP Project Scope

## 1. Project Overview

The goal of this project is to build an MVP web application that allows
users to discover tennis courts in Quito, Ecuador, view their
availability, and make reservations online.

The first version will focus on validating the booking experience and
the operational model with tennis clubs. Online payments will **not** be
included in the initial MVP. Reservations will be confirmed through the
platform, while payment can initially be handled directly by each club.

The architecture should be designed so online payments and a mobile
application can be added later without requiring a major redesign.

## 2. MVP Goals

The MVP should validate whether:

-   Players are willing to search for and reserve tennis courts through
    a centralized platform.
-   Tennis clubs are willing to publish and manage court availability
    through the platform.
-   The platform can reliably prevent conflicting or duplicate
    reservations.
-   The booking process is simple enough to complete quickly from
    desktop or mobile.
-   The operating model can later support online payments and additional
    sports.

## 3. Target Users

### Players

Players should be able to:

-   Sign in to the platform.
-   Browse participating tennis clubs.
-   View courts and basic court information.
-   Select a date.
-   View available time slots.
-   Reserve an available court.
-   View their upcoming and previous reservations.
-   Cancel a reservation when permitted.

### Club Administrators

Club administrators should be able to:

-   Access an administration area.
-   Manage their club information.
-   Create and edit courts.
-   Define court availability.
-   Define booking prices for informational purposes.
-   Block time slots for maintenance, events, or offline reservations.
-   View reservations for their courts.
-   Cancel or manage reservations when necessary.

### Platform Administrator

The platform administrator should be able to:

-   Create and manage clubs.
-   Assign club administrators.
-   View clubs, courts, users, and reservations.
-   Disable clubs or courts when necessary.

## 4. Core MVP Features

### Authentication

Authentication will use Supabase Auth.

Initial authentication methods:

-   Google OAuth.
-   Email/password can be added if needed.

Google should be configured as an external provider through Supabase
Auth so Supabase remains the central authentication layer.

### Club Discovery

Users should be able to browse tennis clubs available on the platform.

Each club may include:

-   Name.
-   Description.
-   Address.
-   Location/map information.
-   Contact information.
-   Images.
-   Available courts.

Advanced geographic search is not required for the first MVP.

### Court Information

Each court should contain basic information such as:

-   Club.
-   Court name or number.
-   Surface type.
-   Indoor/outdoor status.
-   Price per booking period.
-   Active/inactive status.
-   Optional image.

### Availability

Users must be able to select a date and see available booking slots for
a court.

The system must distinguish between:

-   Available.
-   Reserved.
-   Blocked.
-   Unavailable.

Availability must be calculated from the club's configured schedule,
blocked periods, and existing reservations.

### Reservations

A logged-in user can reserve an available time slot.

A reservation should contain at least:

-   User.
-   Club.
-   Court.
-   Start time.
-   End time.
-   Price at the time of booking.
-   Reservation status.
-   Created timestamp.

Initial reservation statuses:

-   `CONFIRMED`
-   `CANCELLED`

The database must enforce rules that prevent overlapping reservations
for the same court.

This protection must exist at the database/server level and must not
rely only on frontend availability checks.

### My Reservations

Users should have a page where they can see:

-   Upcoming reservations.
-   Previous reservations.
-   Cancelled reservations.

Each reservation should show the club, court, date, time, price, and
status.

### Club Administration

Club administrators need a basic dashboard to:

-   View today's/upcoming reservations.
-   Manage courts.
-   Configure availability.
-   Block specific periods.
-   Review reservation details.

The administration interface should prioritize functionality over
advanced analytics in the MVP.

## 5. Payments

Online payments are explicitly **out of scope for MVP v1**.

For the first version, the platform can display:

> Payment at the club

The data model should nevertheless anticipate online payments.

Possible future payment statuses:

-   `NOT_REQUIRED`
-   `PENDING`
-   `PAID`
-   `FAILED`
-   `REFUNDED`

Future payment providers may include PayPhone, Kushki, Datafast, or
another provider suitable for Ecuador.

When payments are introduced, the intended flow is:

    Select time slot
          ↓
    Create temporary reservation
          ↓
    Reservation = PENDING
          ↓
    Redirect/initiate payment
          ↓
    Payment provider
          ↓
    Webhook received by backend
          ↓
    Payment verified
          ↓
    Reservation = CONFIRMED

Temporary reservations should expire automatically if payment is not
completed within a defined period.

## 6. Proposed Technology Stack

### Frontend

-   Next.js 16 (Active LTS) using the App Router.
-   TypeScript with strict type checking.
-   React version managed by the selected Next.js release.
-   Tailwind CSS v4.
-   shadcn/ui components, generated into the application and owned by
    the project.
-   React Hook Form with `@hookform/resolvers` and Zod v4 for complex
    client-side forms, including club, court, schedule, and block
    management.
-   Native HTML forms with Server Actions for simple mutations where
    client-side form state is unnecessary.
-   Axios and TanStack Query for client-side HTTP data fetching, caching,
    and mutation state.

### Testing

-   Vitest and React Testing Library for focused component tests.
-   Component tests should be co-located with the component under test.
-   Provide a shared `renderWithQuery` helper for components that use
    TanStack Query.
-   Playwright is reserved for end-to-end booking-flow coverage.

Dependencies should use the latest compatible patch releases within
these major versions and be reviewed regularly for security updates.

### Backend

-   Next.js Server Actions for authenticated mutations initiated by the
    web application, with Route Handlers reserved for HTTP endpoints,
    integrations, or webhooks.
-   `@supabase/supabase-js` for database and storage access.
-   `@supabase/ssr` for cookie-based Supabase Auth sessions in Next.js;
    its beta status and release notes must be reviewed before upgrades.

### Database

-   Supabase PostgreSQL.

### Authentication

-   Supabase Auth.
-   Google OAuth provider.
-   Cookie-based SSR sessions with the PKCE OAuth flow.

### Authorization

-   Supabase Row Level Security (RLS).
-   Application-level role checks where appropriate.

### File Storage

-   Supabase Storage for club and court images.

### Hosting

-   Vercel.

### ORM

No ORM is required for the initial MVP.

The application will use Supabase's TypeScript client and PostgreSQL
directly where appropriate. Prisma may be evaluated later if backend
complexity makes an ORM beneficial.

## 7. Initial Data Model

The exact schema may evolve during implementation, but the MVP will
likely require the following core entities.

### `profiles`

-   `id`
-   `full_name`
-   `email`
-   `phone`
-   `role`
-   `created_at`

The profile ID should correspond to the Supabase Auth user ID.

### `clubs`

-   `id`
-   `name`
-   `description`
-   `address`
-   `latitude`
-   `longitude`
-   `phone`
-   `active`
-   `created_at`

### `club_admins`

-   `club_id`
-   `user_id`

This allows a user to administer one or more clubs without embedding
club ownership directly into the user record.

### `courts`

-   `id`
-   `club_id`
-   `name`
-   `surface_type`
-   `is_indoor`
-   `price`
-   `active`
-   `created_at`

### `court_schedules`

Defines normal recurring availability.

Possible fields:

-   `id`
-   `court_id`
-   `day_of_week`
-   `start_time`
-   `end_time`
-   `slot_duration_minutes`

### `court_blocks`

Represents periods where a court cannot be booked.

-   `id`
-   `court_id`
-   `start_at`
-   `end_at`
-   `reason`

### `reservations`

-   `id`
-   `user_id`
-   `court_id`
-   `start_at`
-   `end_at`
-   `price`
-   `status`
-   `created_at`
-   `cancelled_at`

The database must prevent overlapping active reservations for the same
court.

## 8. Security Requirements

The MVP should follow these principles:

-   Users must authenticate before making reservations.
-   Users should only be able to modify their own reservations.
-   Club administrators should only manage clubs assigned to them.
-   Public users should only access information intended to be public.
-   Sensitive Supabase service credentials must never be exposed to the
    browser.
-   Row Level Security should be enabled on relevant Supabase tables.
-   Critical reservation validation must happen
    server-side/database-side.
-   Authorization must never rely only on hidden UI elements.

## 9. Reservation Integrity

Preventing double bookings is a critical requirement.

The following scenario must never produce two valid reservations:

    User A ──┐
             ├── Court 3 — 18:00
    User B ──┘

Frontend checks improve the user experience but are not sufficient.

PostgreSQL should enforce reservation integrity through an appropriate
database constraint, transaction, function, or combination of these
mechanisms.

The database is the final source of truth for court availability.

React Hook Form and Zod may be used to provide responsive, accessible
client-side validation for forms. They must not be relied on for
authorization, reservation validation, or prevention of booking
conflicts; those controls must be enforced server-side and in the
database.

## 10. Responsive Design

The MVP will be a responsive web application rather than separate web
and mobile applications.

The booking experience should be designed mobile-first because users
will frequently make reservations from their phones.

Primary supported experiences:

-   Mobile browser.
-   Desktop browser.
-   Tablet browser.

A native mobile application can be developed after the web MVP is
validated.

## 11. Out of Scope for MVP

The following features should **not** be developed initially:

-   Native iOS application.
-   Native Android application.
-   Online payments.
-   Player rankings.
-   Tournament management.
-   Player matchmaking.
-   Social features or chat.
-   Coach marketplace.
-   Membership management.
-   Loyalty programs.
-   Advanced analytics.
-   Dynamic pricing.
-   Multiple sports.
-   Complex notification workflows.
-   Public reviews and ratings.

These features should only be considered after the core reservation
model has been validated.

## 12. Future Roadmap

### Phase 1 --- MVP

-   Authentication.
-   Clubs.
-   Courts.
-   Availability.
-   Reservations.
-   User reservation history.
-   Club administration.
-   Responsive web application.

### Phase 2 --- Payments

-   Payment provider integration.
-   Temporary booking holds.
-   Payment webhooks.
-   Payment confirmation.
-   Refund/cancellation flows.
-   Payment history.

### Phase 3 --- Product Expansion

Potential additions:

-   Email and WhatsApp notifications.
-   Maps and distance-based discovery.
-   Favorites.
-   Player profiles.
-   Coaches and lessons.
-   Recurring reservations.
-   Memberships.
-   Promotions.
-   Reviews.

### Phase 4 --- Mobile

Develop a native/cross-platform application while keeping Supabase as
the shared backend.

Possible technology:

-   React Native / Expo.

### Phase 5 --- Additional Sports

If the tennis model is successful, the domain model can be generalized
to support:

-   Padel.
-   Soccer.
-   Basketball.
-   Squash.
-   Other reservable sports facilities.

## 13. MVP Success Criteria

The MVP can be considered successful when:

1.  At least one real tennis club can manage its courts and
    availability.
2.  A user can authenticate and reserve an available court.
3.  Two users cannot successfully reserve overlapping time periods on
    the same court.
4.  Club administrators can see and manage reservations.
5.  Users can see their upcoming reservations.
6.  The complete booking experience works well on mobile.
7.  The architecture can support adding online payments without
    redesigning the reservation system.

## 14. Development Principle

The primary objective of the MVP is not to build every possible feature.

The objective is to validate one core experience:

> **A player in Quito can quickly find an available tennis court and
> reserve it online.**

All technical and product decisions during the MVP should prioritize
simplicity, reliability, low operating cost, and the ability to learn
from real users.
