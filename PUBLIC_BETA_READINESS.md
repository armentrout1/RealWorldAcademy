# Public Beta Readiness

This branch has moved the Version 2 MVP from prototype toward a usable homeschool beta. Before production deployment, use this checklist to avoid launching with missing database state or unclear family expectations.

## Required Environment

- `DATABASE_URL`: Postgres connection string used by Drizzle and the server.
- `SESSION_SECRET`: strong random string for Express session signing.
- `NODE_ENV=production`: required for secure production cookie behavior.

## Database Sync

The repo is configured for Drizzle with `drizzle.config.ts` and `out: "./migrations"`, but no migration files are currently committed. Before running this branch in a fresh database, apply the schema with:

```bash
npm run db:push
```

New Version 2 tables that must exist:

- `credential_definitions`
- `credential_requirements`
- `issued_credentials`
- `parent_child_relationships`
- `parent_lesson_reviews`
- `curriculum_submissions`

## MVP Flow Checks

- Sign up as a student and confirm `/api/auth/me` returns the current user.
- Complete a lesson at `/learn/money-basics/budgeting-basics`.
- Confirm lesson progress appears in `/portfolio`.
- Issue the Money Basics credential from `/credentials` after requirements are complete.
- Link a parent and child account through the family relationship API.
- Confirm parent review can approve completed lesson work from `/parent-dashboard`.
- Submit a curriculum lesson from `/contribute`.
- Confirm the submission appears in `/admin/lessons` for review after logging in.

## Public Beta Copy and Safety

- Footer links now route to `/privacy`, `/terms`, and `/safety`.
- A global banner states that Real World Academy credentials are non-accredited completion records.
- Credential definitions include a non-accreditation disclaimer.
- External video/resource links should be reviewed before inviting families.

## Known Pre-Launch Gaps

- True admin role enforcement is not implemented yet; admin review routes currently require authentication but not an admin role.
- Production session storage should move from the default in-memory store to Postgres or another durable store.
- More seeded content is needed for Career Exploration and Digital Productivity.
- Bundle size warnings still appear during `npm run build`; this is not blocking, but code-splitting should be considered before a larger launch.
