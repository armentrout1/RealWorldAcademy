# Real World Academy Beta Launch Gate

Use this as the final go/no-go checklist before inviting real families, students, and contributors into a public beta.

## 1. Launch Verdict

Current verdict: Not ready for broad public beta until this checklist is completed.

Available decisions:

- Not ready
- Ready for private family beta
- Ready for creator beta
- Ready for public beta

## 2. Required Environment Checklist

- [ ] `DATABASE_URL` points to the intended beta database.
- [ ] `SESSION_SECRET` is set to a strong production value.
- [ ] `NODE_ENV=production` is set in production.
- [ ] `ADMIN_EMAILS` includes the correct admin accounts.
- [ ] Drizzle schema has been applied with `npm run db:push` or an approved migration path.
- [ ] Session storage table exists and persists login sessions.
- [ ] No database URL or session secret is exposed to the client.
- [ ] Runtime Node version matches the deployment target.
- [ ] `npm.cmd run check` passes.
- [ ] `npm.cmd run build` passes.

## 3. Required Product Flow Checks

Student can:

- [ ] Sign up and log in.
- [ ] Browse learning paths.
- [ ] Start a lesson.
- [ ] Complete a lesson.
- [ ] See progress in dashboard or portfolio.
- [ ] Start an approved collection.
- [ ] Complete collection steps.
- [ ] View issued completion credentials.

Parent can:

- [ ] Sign up and log in.
- [ ] Link or view a child account.
- [ ] See child progress.
- [ ] Review completed work.
- [ ] Browse approved collections.
- [ ] Report a content concern.
- [ ] Understand the non-accredited nature of credentials.

Contributor can:

- [ ] Create or update a contributor profile.
- [ ] Submit a lesson.
- [ ] Submit a resource.
- [ ] Submit a curriculum collection.
- [ ] See submission status.
- [ ] Receive reviewer notes when changes are requested.

Admin can:

- [ ] Log in as admin.
- [ ] Review lesson submissions.
- [ ] Review resource submissions.
- [ ] Review collection submissions.
- [ ] Use the structured review rubric.
- [ ] Approve, reject, request changes, and archive submissions.
- [ ] Manage user roles.
- [ ] Review feedback.
- [ ] Review content reports.
- [ ] Respond to report status quickly.

## 4. Content and Safety Checklist

- [ ] Public pages avoid accreditation, official credit, certification, and guaranteed outcome claims.
- [ ] Terms, privacy, and safety pages are reviewed for beta accuracy.
- [ ] External videos and links in seeded content are reviewed.
- [ ] Every public collection has parent notes or enough context for adult review.
- [ ] Every public contributor item has creator or source attribution.
- [ ] Contributor content is not public until approved.
- [ ] Report concern flow works for families.
- [ ] Admin report queue is checked daily during beta.
- [ ] There is a manual process for archiving problematic content.

## 5. Credential Checklist

- [ ] Credential pages show non-accredited completion language.
- [ ] Credential requirements are visible before issue.
- [ ] Issued credentials show what was completed.
- [ ] Verification links do not expose private student data beyond intended credential details.
- [ ] Parent-reviewed work is represented honestly.
- [ ] No credential claims official school credit, licensure, certification, or state approval.

## 6. Privacy Checklist

- [ ] Student reflections are not public by default.
- [ ] Parent-child relationships are visible only to authorized users.
- [ ] Contributor email addresses are not exposed on public pages unless intentionally shown.
- [ ] Admin notes remain admin-only.
- [ ] Internal review notes remain admin-only.
- [ ] Content reports do not publish reporter information.
- [ ] Public credential verification avoids unnecessary account details.

## 7. Manual Browser and Device Checklist

- [ ] Desktop student flow.
- [ ] Mobile student flow.
- [ ] Desktop parent dashboard.
- [ ] Mobile parent dashboard.
- [ ] Desktop contributor flow.
- [ ] Mobile contributor flow.
- [ ] Desktop admin console.
- [ ] Tablet/mobile admin triage.
- [ ] Collection detail page.
- [ ] Credential verification page.

## 8. Beta Content Seed Checklist

- [ ] At least 3 polished learning paths are ready.
- [ ] At least 3 approved curriculum collections are ready.
- [ ] At least 10 reviewed resources are ready.
- [ ] At least 2 credentials have clear requirements.
- [ ] At least 1 sample parent/student journey can be completed end to end.
- [ ] Test/demo records are clearly labeled or removed before inviting real users.

## 9. Known Deferred Items

These can remain deferred for beta if users are told clearly:

- Accreditation.
- Payments or creator monetization.
- Fully open public posting.
- Public student social feeds.
- Automated content takedown.
- Advanced creator trust automation.
- Full classroom/team management.
- AI auto-generation without human review.

## 10. Decision Log

| Date | Reviewer | Decision | Blockers | Notes |
| --- | --- | --- | --- | --- |
| 2026-06-27 | Pending manual review | Not ready | Launch gate not completed manually | Version 3 creator, collection, resource, admin review, and content report foundations are in progress. |

