# Cross-Repo Document Audit

Date: 2026-06-27

## Purpose

This audit looked across the local Codex workspace for documents, roadmaps, brand guides, launch checklists, QA templates, and product notes that can help Real World Academy become a clearer homeschool alternative and creative curriculum platform.

## Sources Reviewed

## GitHub Repository Inventory

The connected GitHub app currently shows access to repos including:

- `armentrout1/RealWorldAcademy`
- `armentrout1/fixdonenow`
- `armentrout1/ledgerline`
- `armentrout1/projectroll`
- `armentrout1/RealEstateManager`
- `armentrout1/RealEstateManager1`
- `armentrout1/Title-Agent-OS`
- `armentrout1/aarons-painting-revival`
- `armentrout1/aarons-painting-kc`
- `armentrout1/Flowsignnet`
- `armentrout1/view-blocks`
- additional smaller app/site repos.

This pass used local checked-out copies for document reads where available, because those contained the richest docs and avoided cloning every remote repository. A deeper remote-only audit can follow if needed.

### Real World Academy

- `VERSION_2_ROADMAP.md`
- `VERSION_3_ROADMAP.md`
- `PUBLIC_BETA_READINESS.md`
- Attached product prompts for curriculum builder, parent dashboard, content system, resource center, AI companion, learning journeys, and progress dashboards.
- Current public/legal copy in `client/src/pages/About.tsx` and `client/src/pages/LegalInfo.tsx`.

### FixDoneNow

- `docs/brand-positioning.md`
- `docs/brand-terminology-guide.md`
- `docs/mvp-launch-gate.md`
- `docs/mvp-readiness-audit.md`
- `docs/launch-checklist.md`

Useful transfer: clear positioning, claim safety, terminology rules, and launch gate discipline.

### Ledgerline

- `docs/mvp-sandbox-demo-flow.md`
- `docs/mvp-qa-results-template.md`
- `docs/mvp-public-api-verification.md`
- `docs/roadmap-v0.4.md`

Useful transfer: repeatable demo flows, safe test data rules, QA run templates, and release verification.

### ProjectRoll

- `docs/roadmap.md`

Useful transfer: phased roadmap structure, private-by-default sharing logic, and production readiness sequencing.

## Main Lessons To Bring Into Real World Academy

1. Real World Academy needs a stronger public promise.
   The app already has features, but the brand needs a consistent answer to: "What is this, and what is it not?"

2. Claim safety matters.
   Because the product touches children, homeschool planning, credentials, external videos, and contributor content, public language must avoid overclaiming accreditation, certification, school replacement, guaranteed outcomes, or professional advice.

3. The product should lead with family control.
   The differentiator is not just lessons. It is reviewed, organized, real-world learning that parents can use, adapt, and track.

4. Creator freedom needs a review layer.
   Contributor-created curriculum is central to Version 3, but public publishing should stay gated by admin review, safety checks, source checks, and family reporting.

5. Launch readiness should be written down.
   Real World Academy has `PUBLIC_BETA_READINESS.md`; it should now be expanded with Version 3 creator, report, credential, privacy, and external-resource checks.

6. Demo/QA flows should use safe test data.
   Any future public beta demo should clearly use test users, test curriculum, and test credentials so production data and student information are not exposed.

## Docs Created From This Audit

- `docs/brand-positioning.md`
- `docs/terminology-and-claims-guide.md`
- `docs/beta-launch-gate.md`

## Recommended Next Docs

- `docs/manual-beta-qa-run-template.md`
- `docs/content-review-policy.md`
- `docs/contributor-guidelines.md`
- `docs/parent-safety-guide.md`
- `docs/credential-policy.md`
