# Real World Academy Version 2 Roadmap

## Product Direction

Real World Academy helps homeschool families turn free online learning into structured pathways, tracked progress, parent review, and earned credentials.

Version 2 should narrow the app from a broad prototype into a usable MVP. The goal is not to replace every school subject on day one. The goal is to make one complete learning loop work so well that a parent can confidently give it to a student and understand what happened.

## MVP Promise

A student can sign up, choose a pathway, complete guided lessons using curated videos and activities, save progress, submit reflections or project work, receive parent/admin review where needed, and earn a clear non-accredited credential that can appear on a private portfolio or transcript page.

## Core MVP User Journey

1. A parent or student creates an account.
2. The student chooses a structured pathway.
3. The student opens the next lesson.
4. The lesson includes a curated video, short explanation, activity, and reflection.
5. The student saves answers and marks the lesson complete.
6. Progress updates on the student dashboard.
7. The parent can view progress and review submitted work.
8. The student completes all pathway requirements.
9. A credential is issued with transparent completion criteria.
10. The student can view a portfolio/transcript page showing completed credentials and projects.

## MVP Scope

### Keep

- Student dashboard
- Learn/pathway pages
- Lesson player/template
- Progress tracking
- Badges and credentials
- Parent dashboard, simplified to real child progress
- Resource/video library
- Curriculum contribution flow
- Admin lesson/curriculum review
- Basic profile/settings

### Hide or Defer

- Teacher dashboard
- Community discussion areas
- Team projects
- Broad AI feature surfaces
- Full Buddy companion complexity
- Smart lesson generator
- Large curriculum builder experience
- Public social features
- Leaderboards
- Advanced gamification
- Multi-student classroom management

These features can remain in code but should be hidden from primary navigation until the core learning loop is real.

## First Public Beta Pathways

Start with three strong, practical pathways instead of trying to cover every subject.

### 1. Money Basics

Target: ages 12-18

Credential: Money Basics Credential

Suggested lessons:

- Needs vs. wants
- Budgeting
- Saving goals
- Credit and debt basics
- Banking and debit cards
- Taxes and paychecks
- Final project: create a simple monthly budget

### 2. Career Exploration

Target: ages 13-18

Credential: Career Explorer Credential

Suggested lessons:

- Strengths and interests
- Career research
- Job shadowing/interviews
- Resume basics
- Interview basics
- Workplace communication
- Final project: career profile and next-step plan

### 3. Digital Productivity

Target: ages 10-18

Credential: Digital Productivity Credential

Suggested lessons:

- Files, folders, and cloud storage
- Google Docs or Microsoft Word basics
- Spreadsheets basics
- Email etiquette
- Online research
- Digital safety
- Final project: create and submit a polished document or spreadsheet

## Credential Model

Credentials should be honest and transparent. They should not imply accreditation or official school credit.

Each credential should show:

- Credential title
- Student name
- Issued date
- Pathway completed
- Lessons completed
- Required activities completed
- Final project or reflection status
- Reviewer, if applicable
- Unique credential ID or share code

Example language:

Real World Academy Credential: Money Basics

Awarded for completing 7 guided lessons, 6 reflections, and 1 parent-reviewed budget project.

## Curriculum Contribution Model

User-created curriculum is valuable, but it needs review before publication.

### Contributor Flow

1. Contributor creates a lesson, pathway, resource, or video recommendation.
2. Submission enters `draft` or `pending_review`.
3. Admin reviews for safety, quality, age fit, copyright concerns, and educational usefulness.
4. Admin can approve, reject, or request changes.
5. Approved content becomes visible in the public library.

### Content Statuses

- `draft`
- `pending_review`
- `changes_requested`
- `approved`
- `rejected`
- `archived`

### Review Checks

- Is the content age-appropriate?
- Is the source trustworthy?
- Is the video embeddable and available?
- Does the lesson have a clear objective?
- Does it include an activity or reflection?
- Does it avoid medical, legal, or financial advice beyond general education?
- Does it avoid copyrighted copied content?
- Does it match a pathway or credential requirement?

### Publishing Rule

Students and parents should only see approved curriculum content. Contributors can see their own drafts and submissions.

## Version 2 Build Phases

### Phase 1: Stabilize the Prototype

Goal: make the app reliable enough to build on.

Tasks:

- Fix TypeScript errors.
- Fix backend/schema drift.
- Add or document local database setup.
- Make `npm run check` pass.
- Make `npm run build` pass after typecheck.
- Address critical/high dependency vulnerabilities where practical.
- Remove Replit badge/script from production HTML if not needed.
- Add a simple health/readiness endpoint.

Exit criteria:

- App starts locally with documented environment variables.
- Typecheck passes.
- Production build passes.
- Core routes do not crash.

### Phase 2: Navigation and MVP Focus

Goal: hide distractions and make the app feel intentional.

Tasks:

- Create a feature flag or navigation config.
- Hide deferred pages from main navigation.
- Keep routes available for development if useful.
- Make the home page explain the focused MVP.
- Make dashboard show next lesson, active pathway, progress, and earned credentials.
- Rename broad “Learn” surfaces around pathways.

Exit criteria:

- A new user sees a clear product, not a giant unfinished platform.
- Main navigation only exposes MVP features.

### Phase 3: Real Accounts and Roles

Goal: replace demo login with real users.

Tasks:

- Implement real signup/login/logout.
- Hash passwords.
- Add authenticated session handling.
- Add roles: `student`, `parent`, `admin`.
- Add parent-child relationship model.
- Remove hardcoded user ID usage from frontend contexts.
- Protect account-specific API routes.

Exit criteria:

- A student can create an account and return later.
- A parent can be connected to a child.
- Progress belongs to the logged-in user.

### Phase 4: Pathways, Lessons, and Video Content

Goal: make the learning content database-driven.

Tasks:

- Add API routes for pathways/subjects.
- Add API routes for lessons.
- Replace static Learn data with real backend data.
- Add lesson video/resource fields.
- Support YouTube embed URLs.
- Add lesson ordering inside pathways.
- Add pathway requirements.
- Build the MVP lesson player from real lesson data.

Exit criteria:

- Student can browse real pathways from the database.
- Student can open real lessons.
- Lesson content is not hardcoded in React pages.

### Phase 5: Progress and Completion

Goal: make student work persist.

Tasks:

- Save lesson start/completion state.
- Save reflection answers.
- Save activity/project submissions.
- Calculate pathway progress from lesson completion.
- Award badges based on real completion.
- Add timeline events from real actions.
- Add student “continue where you left off.”

Exit criteria:

- A student can complete lessons across multiple sessions.
- Dashboard progress reflects real completed work.

### Phase 6: Credentials and Portfolio

Goal: turn learning into proof.

Tasks:

- Add credential definitions.
- Add credential requirements.
- Add issued credentials.
- Add credential detail page.
- Add printable/shareable credential view.
- Add student portfolio/transcript page.
- Add parent/admin review before final credential issuance when required.

Exit criteria:

- Completing a pathway can issue a credential.
- The credential clearly shows what was completed.
- Student has a record of earned credentials.

### Phase 7: Parent Review

Goal: make the homeschool use case feel real.

Tasks:

- Simplify parent dashboard around actual child data.
- Show active pathways, completed lessons, reflections, and projects.
- Let parent approve/review final projects.
- Add parent notes.
- Add weekly progress summary.

Exit criteria:

- A parent can understand what their child did.
- A parent can review credential-related submissions.

### Phase 8: Contributor and Admin Review

Goal: allow curriculum contribution without opening the door to unreviewed content.

Tasks:

- Convert lesson contribution form to real submissions.
- Store contributor profile info.
- Add admin review queue backed by real data.
- Add approve/reject/request-changes workflow.
- Add reviewer notes.
- Publish approved lessons/resources/pathways.
- Hide unapproved content from students.

Exit criteria:

- Users can submit curriculum.
- Admin can review and publish it.
- Public content remains controlled.

### Phase 9: Content Seeding

Goal: have enough real content for beta users.

Tasks:

- Create Money Basics pathway.
- Create Career Exploration pathway.
- Create Digital Productivity pathway.
- Add 5-8 lessons per pathway.
- Add curated YouTube videos where helpful.
- Add at least one final project per pathway.
- Add credential requirements for each pathway.

Exit criteria:

- A student can earn at least one real credential.
- A parent can test the complete loop.

### Phase 10: Public Beta Readiness

Goal: put the app in front of real families.

Tasks:

- Add privacy policy and terms.
- Add clear non-accreditation disclaimer.
- Add safety language for minors.
- Add basic error states and empty states.
- Add analytics or event tracking.
- Add feedback/contact flow.
- Add seed/demo data for screenshots.
- Run accessibility and mobile pass.
- Deploy to production.

Exit criteria:

- App is usable by a small group of families.
- Feedback can be collected.
- No obvious unfinished surfaces are in primary navigation.

## Suggested Data Additions

### Roles and Relationships

- `roles`
- `user_roles`
- `parent_child_relationships`

### Pathways

- `pathways`
- `pathway_lessons`
- `pathway_requirements`

### Submissions

- `lesson_submissions`
- `project_submissions`
- `reviews`

### Credentials

- `credential_definitions`
- `credential_requirements`
- `issued_credentials`

### Curriculum Review

- `curriculum_submissions`
- `curriculum_reviews`
- `published_content_versions`

## Navigation for MVP

Primary navigation:

- Dashboard
- Pathways
- Lessons
- Credentials
- Portfolio
- Parent Dashboard
- Contribute

Admin navigation:

- Review Queue
- Content Library
- Credentials
- Users

Hidden/deferred navigation:

- Teacher Dashboard
- Community
- Team Projects
- Smart Lesson Generator
- Full Buddy tools
- Leaderboard

## Quality Bar

Before public beta:

- No hardcoded demo user for real flows.
- No visible “coming soon” on primary MVP paths.
- No unreviewed curriculum shown publicly.
- No credential issued without clear requirements.
- No broken start/complete lesson flow.
- No account-specific data exposed without auth.
- No critical dependency vulnerability left unexamined.

## Recommended First Sprint

Sprint goal: make the app build cleanly and narrow the product.

Tasks:

1. Fix TypeScript errors.
2. Add MVP navigation config.
3. Hide deferred pages from main nav.
4. Add `/api/health`.
5. Add `/api/subjects` and `/api/lessons` routes or rename to pathway routes.
6. Replace fake Learn query with real API data.
7. Create initial credential schema draft.
8. Add one Money Basics pathway seed.

Deliverable:

A cleaner app where the visible experience points toward the Version 2 MVP.

