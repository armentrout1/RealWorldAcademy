# Real World Academy Version 4 Marketplace Roadmap

## Product Direction

Version 3 is building the trusted creative curriculum layer: contributor profiles, reviewed curriculum collections, resources, admin review, discovery, and family reporting.

Version 4 should turn that trusted content system into an educator marketplace where teachers, educators, tutors, mentors, and creator-teachers can teach online, publish free samples, offer paid classes or learning services, and help students move from point A to point B.

The mission stays fixed:

> Real World Academy helps people get back to real learning: factual skills, practical understanding, human creativity, useful work, and guided growth.

## Version 4 Promise

An educator can build a profile, show free sample teaching, submit classes or learning services for review, and eventually earn money through paid offerings. Families can browse trusted educators, compare learning paths, enroll in free or paid classes, and keep student progress connected to portfolios and completion credentials.

## Core Marketplace Model

### Learners and Students

- Browse classes, lessons, collections, and educators.
- Join free or paid learning experiences.
- Complete lessons, projects, and class requirements.
- Track progress and portfolio evidence.
- Earn honest non-accredited completion credentials.

### Parents and Families

- Choose educators and learning paths.
- Review class details, age fit, safety notes, and parent expectations.
- Manage enrollments and student progress.
- Report concerns.
- Understand what is free, what is paid, and what counts toward credentials.

### Educators, Teachers, Tutors, Mentors, and Creator-Teachers

- Build educator profiles.
- Publish free samples.
- Submit curriculum, classes, tutoring offers, or bundles for review.
- Offer live classes, recorded courses, one-on-one tutoring, coaching, or curriculum bundles.
- Build reputation and eventually earn income.

### Real World Academy Admins

- Review educator profiles and offerings.
- Enforce safety, child protection, credential honesty, and marketplace quality.
- Manage reports, disputes, refunds, and trust levels.
- Operate the school/platform layer.

## Marketplace Build Phases

### Phase 1: Educator Profile Upgrade

Goal: turn contributor profiles into real educator profiles.

Tasks:

- Add educator role language throughout contributor surfaces.
- Add profile fields: teaching style, subjects, age groups, intro video, sample lesson links, availability, time zone, and offering types.
- Let educators mark whether they offer free content, live classes, recorded courses, tutoring, coaching, or curriculum bundles.
- Add public educator profile pages.
- Keep admin-only trust/safety notes separate from public profile copy.

Exit criteria:

- A teacher or educator can present themselves professionally.
- Families can understand who the educator is and what they teach.

Current build status:

- `green`: contributor profiles now include educator-ready fields for teaching style, subjects, age groups, intro video, sample lessons, availability, time zone, and future offering types.
- `green`: educator profile editor lets teachers describe how and what they teach.
- `green`: educator dashboard shows a profile snapshot for marketplace discovery readiness.
- `green`: public educator profile pages show teaching style, samples, availability, and approved offerings.

### Phase 2: Offering Schema and Review

Goal: model the things educators can offer before adding payments.

Tasks:

- Add `educator_offerings` table.
- Support offering types: free sample, live class, recorded course, tutoring, coaching, curriculum bundle.
- Support price placeholder fields without payment processing yet.
- Add draft, pending review, approved, changes requested, rejected, and archived states.
- Add admin review queue for offerings.
- Add report support for offerings.

Exit criteria:

- Educators can draft offerings.
- Admins can review offerings.
- Approved offerings can appear on educator profiles.

Current build status:

- `green`: `educator_offerings` schema exists with free sample, live class, recorded course, tutoring, coaching, and curriculum bundle support.
- `green`: educator dashboard can create draft offerings or submit them for review.
- `green`: admin management has an educator offering review queue.
- `green`: approved offerings are shown on public educator profiles.
- `yellow`: editing existing offerings from the dashboard still needs a polished UI.

### Phase 3: Discovery and Marketplace Browse

Goal: let families find the right educator or class.

Tasks:

- Add `/educators` browse page.
- Add filters for subject, age group, format, live/recorded, free/paid, duration, and trust level.
- Add educator cards with sample content, subjects, and approved offering counts.
- Add offering detail pages.
- Add interest/inquiry button before payments.

Exit criteria:

- Families can browse educator profiles and approved offerings.
- The marketplace can operate manually before payment automation.

Current build status:

- `green`: `/educators` marketplace browse page exists.
- `green`: families can search and filter educators by subject, age group, and future offering format.
- `green`: `/educators/:id` detail pages show approved offerings and trust notes.
- `green`: families can send interest/inquiry requests from approved offerings before payments are enabled.

### Phase 4: Scheduling and Enrollment Foundation

Goal: support classes and tutoring sessions without overbuilding.

Tasks:

- Add class session model.
- Add enrollment/interest model.
- Let families request or join approved offerings.
- Add educator dashboard view for interested families/enrollments.
- Add admin view for class/session activity.
- Keep live-class delivery external at first, with meeting link fields reviewed by admin.

Exit criteria:

- Educators can manage class interest or early enrollments.
- Families can express interest or reserve a seat.
- Admins can oversee activity.

Current build status:

- `green`: `offering_interests` schema exists for pre-payment family inquiries.
- `green`: public educator offerings can collect family interest requests.
- `green`: educator dashboard includes a family interest queue with follow-up statuses.
- `green`: admin management includes marketplace interest oversight.
- `green`: `offering_sessions` schema exists for live classes, tutoring windows, capacity, and external meeting links.
- `green`: educators can draft or submit sessions for approved offerings.
- `green`: admins can review session dates, capacity, and meeting links before public discovery.
- `green`: public educator profiles show approved sessions and let families request a specific seat.
- `green`: `offering_enrollments` schema exists for requested, reserved, waitlisted, cancelled, completed, and archived seat states.
- `green`: specific session seat requests create enrollment records and can be managed by educators or admins.
- `green`: moving enrollments into or out of reserved/completed status updates session reserved seat counts.
- `green`: families can view requested, reserved, waitlisted, and completed session enrollments from `/my-classes`.
- `green`: learner dashboard and navigation now link into family class tracking.
- `yellow`: calendar integrations and payment-backed enrollment still need future passes.

### Phase 5: Payments and Platform Fee

Goal: turn approved educator offerings into real paid products.

Tasks:

- Add payment provider integration.
- Add platform fee model.
- Add educator payout account onboarding.
- Add checkout for approved paid offerings.
- Add refund/cancellation status fields.
- Add clear family receipts.
- Add educator earnings dashboard.

Exit criteria:

- Families can pay for approved offerings.
- Educators can see earnings.
- Real World Academy can collect a platform fee.

### Phase 6: Reviews, Trust, and Quality

Goal: let the marketplace improve quality over time.

Tasks:

- Add parent/student reviews after completed offerings.
- Add educator response tools.
- Add admin moderation for reviews.
- Track approved count, completion count, report count, refund count, and repeat enrollment.
- Expand trust levels based on behavior.

Exit criteria:

- Families can judge educator quality.
- Admins can identify strong or risky educators.
- Trust levels are based on more than manual labels.

### Phase 7: Credential and Portfolio Integration

Goal: connect paid/free classes to the learning record.

Tasks:

- Let approved offerings count toward selected completion credentials.
- Let educators define completion evidence.
- Let parents approve work from classes.
- Add class completion records to student portfolios.
- Add credential eligibility badges on offering pages.

Exit criteria:

- Marketplace learning connects back into the Real World Academy progress and credential system.

## Version 4 Quality Bar

- No paid educator offering appears publicly without approval.
- No educator can claim accreditation, licensing, or guaranteed outcomes unless verified and legally safe.
- Families can tell what is free, what is paid, what is live, and what is recorded.
- Parent expectations are clear before enrollment.
- Admins can pause, archive, refund, or investigate problematic offerings.
- Student data stays private by default.
- Paid classes support the mission instead of distracting from it.

## Deferred Until Later

- Fully native live video classroom.
- Subscription school/co-op accounts.
- Automated educator tax reporting beyond payment provider basics.
- Public social feeds.
- Student-to-student open messaging.
- AI teacher agents.
- Accreditation or official school credit.

## First Build Recommendation

Start with Phase 1 and Phase 2 together:

1. Upgrade contributor profiles into educator-ready profiles.
2. Add offering schema and review states.
3. Add educator dashboard section for offerings.
4. Add admin offering review queue.
5. Show approved free/pending paid offerings on public educator profiles.

This creates the marketplace skeleton without taking payment risk too early.
