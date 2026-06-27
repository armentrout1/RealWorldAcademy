# Real World Academy Version 3 Roadmap

## Product Direction

Version 2 turned Real World Academy into a usable homeschool beta: students can learn, parents can review, contributors can submit lessons, admins can publish approved content, and credentials can be issued and verified.

Version 3 should turn that beta into a creative curriculum platform.

The core idea is simple: families, educators, creators, and mentors should be able to organize useful free learning into safe, reviewed, structured homeschool pathways. The platform should make creation easy while keeping publication trustworthy.

## Version 3 Promise

A contributor can create a lesson, resource, or full curriculum collection using original activities and curated free videos. Real World Academy reviews it for safety and quality, publishes it into discoverable pathways, and lets families use it as part of a student portfolio and credential journey.

## Core Version 3 User Journeys

### Contributor Journey

1. A contributor creates or claims a contributor profile.
2. The contributor builds a lesson, resource, or curriculum collection.
3. The contributor can add curated YouTube videos, discussion prompts, activities, parent notes, and reflection questions.
4. The contributor submits the content for review.
5. Admins review the submission with a structured rubric.
6. Approved content publishes into the public learning library.
7. Contributor profile shows published work and trust status.

### Parent/Student Journey

1. A family browses approved pathways, collections, and lessons.
2. A parent can filter by age, subject, duration, format, and parent-led/student-led.
3. A student starts a lesson or collection.
4. Progress, reflections, and parent reviews continue feeding the portfolio and credential system.
5. Families can report or flag content if something feels inaccurate, unsafe, or inappropriate.

### Admin Journey

1. Admins see a queue of lesson, resource, and collection submissions.
2. Admins review safety, age fit, source quality, originality, learning usefulness, and credential fit.
3. Admins approve, reject, request changes, archive, or flag content.
4. Admins can manage contributor trust levels and published content.

## MVP Scope for Version 3

### Build

- Contributor profiles
- Contributor dashboard
- Curriculum collection builder
- YouTube/video resource support
- Review rubric and structured review status
- Published content discovery
- Creator attribution on lessons/resources
- Family content reporting
- Admin content management console

### Keep Controlled

- Public publishing should still require review.
- Trusted creators can have faster review, but not unrestricted publishing at first.
- Student-facing content should only show approved/published items.
- AI generation can assist drafting, but should not auto-publish.

### Defer

- Paid creator marketplace
- Public social feeds
- Ratings/reviews from students
- Creator monetization
- Fully open posting without review
- Complex classroom/team management

## Version 3 Build Phases

### Phase 1: Contributor Identity

Goal: make creators visible and accountable.

Tasks:

- Add contributor profile model.
- Link contributor profiles to user accounts.
- Store display name, bio, affiliation, website, avatar, expertise tags, and trust level.
- Show creator attribution on published lessons.
- Add contributor profile page.
- Add contributor dashboard showing submissions and published content.

Exit criteria:

- A contributor can have a profile.
- Published lessons can show who created or curated them.
- Admins can see contributor context during review.

### Phase 2: Curriculum Collections

Goal: let people build more than one-off lessons.

Tasks:

- Add curriculum collection model.
- Add collection items that can reference lessons, resources, videos, or external links.
- Support title, description, subject, age group, estimated duration, learning goals, parent notes, and final project.
- Add draft and pending review states.
- Add collection builder UI.
- Add public collection detail page for approved collections.

Exit criteria:

- A contributor can submit a multi-lesson curriculum.
- Admins can review it.
- Families can browse and start approved collections.

Current build status:

- `green`: `curriculum_collections` and `curriculum_collection_items` are modeled in the shared schema.
- `green`: collection items can represent lessons, resources, videos, activities, or external links.
- `green`: logged-in contributors with creator profiles can save draft collections from `/curriculum-collections`.
- `green`: contributors can submit draft collections into `pending_review`.
- `green`: admins can review collections from the admin management console and approve, publish, request changes, reject, or archive them.
- `green`: families can browse approved/published collections from `/collections`.
- `green`: public collection detail pages show sequence items, creator attribution, learning goals, parent notes, and final project.
- `green`: logged-in users can start approved collections and mark ordered steps complete.
- `green`: collection detail pages show percent complete and completed step counts.

### Phase 3: Video and Resource Curation

Goal: support the original vision of organizing free learning from YouTube and the web.

Tasks:

- Add resource submission model for videos, links, PDFs, and activities.
- Add YouTube URL parsing and embed support.
- Store video title, URL, embed URL, source/channel, duration, age fit, and safety notes.
- Let contributors attach videos/resources to lessons and collections.
- Add parent discussion prompts and student reflection prompts for videos.
- Add admin checks for source quality and embeddability.

Exit criteria:

- A contributor can build a lesson around a YouTube video.
- Students can watch/open curated resources from the lesson.
- Parents can see why the resource was included.

Current build status:

- `green`: collection video items store source/channel, duration, safety notes, and derived YouTube embed URLs.
- `green`: creator collection builder asks for parent-facing video context.
- `green`: admin review shows video source, duration, embed URL, and safety notes.
- `green`: public collection detail pages can embed YouTube videos in context with parent/student prompts.
- `green`: contributors can submit standalone videos, links, guides, worksheets, and activities for review from `/contribute-resource`.
- `green`: admins can review resource submissions and approve them into the public Resource Center.
- `green`: lesson contributors can attach one curated resource/video during submission.
- `green`: approved contributed lessons publish attached resources into `lesson_resources`.
- `green`: lesson pages render attached videos/resources with source, safety notes, parent prompts, and student prompts.

### Phase 4: Review Rubric 2.0

Goal: make review consistent enough to scale.

Tasks:

- Add rubric fields to curriculum review.
- Include checks for safety, age fit, source trust, originality, usefulness, clarity, and credential alignment.
- Add review outcomes: pending, in review, changes requested, approved, published, rejected, flagged, archived.
- Add reviewer notes visible to contributors.
- Add internal-only admin notes.
- Add content versioning fields for future revisions.

Exit criteria:

- Admin review is structured, not just a status dropdown.
- Contributors know what to fix.
- Published content has a clear audit trail.

### Phase 5: Discovery and Search

Goal: help families find useful material.

Tasks:

- Add search/filtering across approved lessons, resources, and collections.
- Filter by age group, subject, format, duration, parent-led/student-led, video-based/project-based, and credential eligible.
- Add collection cards to learning surfaces.
- Add creator attribution and trust indicators.
- Add featured collections.

Exit criteria:

- Families can browse the creative library without needing to know exact pathway names.
- Approved community content feels findable and safe.

### Phase 6: Family Reporting and Safety

Goal: create a feedback loop for quality and trust.

Tasks:

- Add report/flag action on published lessons, resources, and collections.
- Add report categories: inaccurate, unsafe, age mismatch, broken link, copyright concern, other.
- Add admin report queue.
- Allow admins to unpublish or archive flagged content.
- Add safety language around external videos and parent responsibility.

Exit criteria:

- Families can flag problematic content.
- Admins can respond quickly.
- The platform has a basic safety loop.

### Phase 7: Creator Trust Levels

Goal: reward high-quality contributors while preserving review.

Tasks:

- Add trust levels: new, verified, trusted, partner, restricted.
- Show trust level in admin review.
- Track approved count, rejected count, flagged count, and response history.
- Allow trusted contributors to receive expedited review.
- Keep student-facing publishing gated by approval.

Exit criteria:

- Admins can prioritize trustworthy contributors.
- The platform can scale without opening the floodgates.

### Phase 8: Credential and Collection Alignment

Goal: make creative content useful for credentials.

Tasks:

- Let admins mark lessons/collections as credential eligible.
- Let credential requirements reference approved community lessons or collections.
- Show families whether a lesson counts toward a credential.
- Add final project templates for collections.

Exit criteria:

- Community-created content can support credential pathways after review.
- Credential requirements remain transparent.

## Suggested Data Additions

### Contributor System

- `contributor_profiles`
- `contributor_expertise_tags`
- `contributor_stats`

### Curriculum Collections

- `curriculum_collections`
- `curriculum_collection_items`
- `collection_reviews`

### Resource Curation

- `resource_submissions`
- `lesson_resources`
- `video_resources`

### Review and Safety

- `review_rubrics`
- `content_reports`
- `content_versions`
- `published_content_audit_log`

## Version 3 Quality Bar

- No unreviewed contributor content appears to students.
- Every public lesson/resource/collection has a creator or source attribution.
- Every external video has enough context for a parent to judge its usefulness.
- Admins can see why content was approved.
- Families can report problematic content.
- Published content is searchable by age, topic, format, and duration.
- Credential-eligible content clearly says what it counts toward.

## Checkpoints

Use these checkpoints before moving from one phase to the next. Each checkpoint should be marked `green`, `yellow`, or `red` in a short project note or commit summary.

### Checkpoint 1: Contributor Identity

Questions:

- Can a real user create or update a contributor profile?
- Does the profile make the creator more trustworthy to a parent?
- Can admins see contributor context while reviewing submissions?
- Can published lessons show creator attribution?

Pass condition:

Contributor identity exists in the product and is tied to submitted or published curriculum.

Current build status:

- `green`: contributor profiles can be created and edited by logged-in users.
- `green`: contributor submissions can link to creator profiles.
- `green`: contributors can see their own submission status in a dashboard.
- `green`: admins can see contributor profile context in the curriculum review queue.
- `yellow`: published lesson pages show creator attribution indirectly through lesson metadata; a richer public creator card can come next.

### Checkpoint 2: Creative Curriculum Building

Questions:

- Can a contributor build a full collection, not just one lesson?
- Can a collection include lessons, resources, videos, parent notes, and a final project?
- Is the draft/review/publish path clear?
- Does the collection feel usable by a homeschool family?

Pass condition:

A contributor can submit a multi-step learning path and a family can use the approved version.

Current build status:

- `green`: creators can draft a full collection instead of only one lesson.
- `green`: collections can include ordered videos, lesson references, resources, activities, links, parent prompts, student prompts, parent notes, and a final project.
- `green`: draft, submit-for-review, admin review, and publish states are wired.
- `green`: families can inspect approved collection detail pages.
- `green`: families can start approved collections and track step completion.

### Checkpoint 3: Video Curation

Questions:

- Can contributors add YouTube links safely?
- Does the app extract or store enough video metadata to make review practical?
- Can parents see why the video is included?
- Can students watch/open the video in context with activity and reflection prompts?

Pass condition:

The app can organize free video learning into structured, reviewable lessons.

### Checkpoint 4: Review Quality

Questions:

- Is the admin review process more than a status dropdown?
- Are safety, age fit, originality, source quality, and learning usefulness captured?
- Can contributors understand requested changes?
- Can admins unpublish or flag content if needed?

Pass condition:

Review is consistent enough that the platform can accept more creators without losing trust.

### Checkpoint 5: Discovery

Questions:

- Can families browse by age, subject, duration, format, and credential eligibility?
- Are creator attribution and trust signals visible?
- Can approved community content be found without knowing its exact name?
- Are unreviewed submissions hidden from public/student surfaces?

Pass condition:

Families can discover useful approved content with confidence.

### Checkpoint 6: Safety and Reporting

Questions:

- Can families report content concerns?
- Can admins triage reports?
- Can content be archived or unpublished quickly?
- Does the product explain parent responsibility around external resources?

Pass condition:

The creative ecosystem has a basic safety loop.

### Checkpoint 7: Credential Alignment

Questions:

- Can approved community content count toward credentials only when admins choose?
- Is credential eligibility visible to families?
- Do credentials still clearly explain what was completed?
- Is contributor-created content kept separate from official/accredited language?

Pass condition:

Creative curriculum can support transparent credentials without overclaiming.

### Final Version 3 Checkpoint

Questions:

- Can a creator create meaningful curriculum?
- Can an admin review and publish it safely?
- Can a family find and use it?
- Can a student complete it and have the work appear in their learning record?
- Can the platform preserve trust while encouraging creativity?

Pass condition:

Real World Academy feels like a controlled creative curriculum ecosystem, not just a static lesson app.

## Recommended First Sprint

Sprint goal: make contributors real people in the system.

Tasks:

1. Add contributor profile schema.
2. Add contributor profile API.
3. Add contributor onboarding/edit page.
4. Link curriculum submissions to contributor profiles.
5. Show contributor attribution on published lessons.
6. Add contributor dashboard with submission status.
7. Add admin contributor context in the review queue.

Deliverable:

A creator can have an identity, submit curriculum under that identity, and see what happened to their work. This is the foundation for the creative ecosystem.
