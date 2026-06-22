# Public Beta Readiness

This branch has moved the Version 2 MVP from prototype toward a usable homeschool beta. Before production deployment, use this checklist to avoid launching with missing database state or unclear family expectations.

## Required Environment

- `DATABASE_URL`: Postgres connection string used by Drizzle and the server.
- `SESSION_SECRET`: strong random string for Express session signing.
- `NODE_ENV=production`: required for secure production cookie behavior.
- `ADMIN_EMAILS`: comma-separated allowlist for accounts that should become admins on signup, login, or `/api/admin/bootstrap`.

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
- `feedback_submissions`
- `user_sessions`

The `user_sessions` table is created automatically by the Postgres session store when the server starts.

## Roles

User accounts now include a `role` field:

- `student`
- `parent`
- `admin`

Public signup can create `student` or `parent` accounts. Emails listed in `ADMIN_EMAILS` are promoted to `admin` on signup, login, session refresh, or by calling `/api/admin/bootstrap` while signed in. Existing admins can manage user roles from `/admin/lessons`.

## MVP Flow Checks

- Sign up as a student and confirm `/api/auth/me` returns the current user.
- Complete a lesson at `/learn/money-basics/budgeting-basics`.
- Open Career Exploration and Digital Productivity from `/learn` and confirm each pathway shows seeded lessons.
- Confirm lesson progress appears in `/portfolio`.
- Issue the Money Basics credential from `/credentials` after requirements are complete.
- Open the issued credential verification link from `/portfolio` or `/credentials`.
- Link a parent and child account from `/parent-dashboard`.
- Confirm parent review can approve completed lesson work from `/parent-dashboard`.
- Submit a curriculum lesson from `/contribute`.
- Confirm the submission appears in `/admin/lessons` for review after logging in as an admin.
- Approve a curriculum submission and confirm it publishes into the matching learning pathway.
- Submit beta feedback from `/feedback`.
- Confirm feedback and user roles can be managed from `/admin/lessons`.
- Confirm an `ADMIN_EMAILS` account can reach `/admin/lessons` without a manual database role edit.

## Public Beta Copy and Safety

- Footer links now route to `/privacy`, `/terms`, and `/safety`.
- Families can submit beta feedback from `/feedback`.
- A global banner states that Real World Academy credentials are non-accredited completion records.
- Credential definitions include a non-accreditation disclaimer.
- External video/resource links should be reviewed before inviting families.

## Known Pre-Launch Gaps

- Run a full launch QA pass with fresh student, parent, and admin accounts before inviting families.
- Bundle size warnings still appear during `npm run build`; this is not blocking, but code-splitting should be considered before a larger launch.
