---
name: homepage-design
description: Redesign the Medi-care homepage incrementally using the provided reference style while preserving the existing Next.js architecture and GraphQL/Apollo integration.
---

# Medi-care Homepage Design Skill

Use this skill when redesigning or reviewing the Medi-care homepage UI.

## Read First

- Read `AGENTS.md`.
- Go outside this client project and read `Medi-care/docs/ai`.
- Prioritize `docs/ai/FRONTEND_MIGRATION.md`, `docs/ai/BACKEND_MIGRATION.md`, `docs/ai/DECISIONS.md`, and `docs/ai/COMPLETED_TASKS.md`.
- Inspect the current homepage components, styles, layout, routes, and GraphQL usage before editing.

## Goal

Convert the inherited `nestar-next` homepage into a calm, clinic-style Medi-care homepage focused on hospitals, famous doctors, appointment booking, and patient trust.

## Review Checklist

- Confirm homepage terminology uses Medi-care language, not property, real-estate, petshop, product, or agent wording.
- Preserve current project architecture; do not rewrite the whole app.
- Keep GraphQL/Apollo integration unchanged unless the homepage data query requires a small safe update.
- Use the provided reference image for visual direction, but adapt it to the healthcare domain.
- Match the reference mood: clean clinic photography, soft white space, muted olive/green-gray accents, restrained typography, and trustworthy medical spacing.
- Make the first viewport clearly communicate Medi-care, hospitals, doctors, and appointment booking.
- Prefer a full-width hero with real hospital/clinic imagery, light/dark overlay only when needed for readable text, and simple navigation.
- Prefer practical homepage sections:
  - hero / search entry
  - quick navigation tiles
  - `Popular Hospitals`
  - `Famous Doctors`
  - appointment call-to-action
- Replace inherited real-estate homepage groups:
  - `Trend Hospital`
  - `Top Hospital`
  - `Popular Hospital`
  - `Top Agents`
- Use only one hospital card section named `Popular Hospitals` and one doctor card section named `Famous Doctors`.
- Do not keep old agent-centered wording; doctor profiles replace agent cards.
- Keep changes incremental and scoped to homepage-related components/styles.
- Do not remove working logic unless replaced safely.
- Keep responsive behavior clean on mobile, tablet, and desktop.
- Ensure text does not overlap, overflow, or rely on viewport-scaled font sizes.
- Avoid one-note color palettes and avoid copying old property-card visual language blindly.
- Keep colors harmonious with provided hospital reference images; avoid loud marketplace styling.
- Run Yarn-based validation after each phase.
- Update `Medi-care/docs/ai/COMPLETED_TASKS.md` after a major completed homepage change.

## Hospital Detail Expectations

- When a user opens one hospital, the page should support hospital-centered information:
  - hospital overview and description
  - hospital images/gallery
  - doctors working at or presented for that hospital experience
  - doctor profile summary and specialization
  - doctor working hours from doctor schedule data
  - hospital address and map section
- Keep appointments doctor-based according to the ER model; do not add `hospitalId` to appointment mutations.
- If backend linkage between hospital and doctor is not available yet, present UI structure safely and document the data dependency instead of inventing a schema.

## Visual Direction

- Use reference-like styling: spacious Korean clinic website rhythm, clean header, wide hero image, simple tab/quick-menu blocks, and quiet medical colors.
- Favor real clinic/hospital photos over abstract illustrations.
- Use cards sparingly and keep them refined: clear image, title, location/specialization, and one primary action.
- Prefer clear CTA labels such as `View Hospital`, `View Doctor`, `Book Appointment`, and `Get Directions`.
- Map UI should be a dedicated location section, not hidden inside a crowded card.

## Implementation Notes

- Use existing layout, theme, component, and style conventions first.
- Use real or relevant medical visual assets when the design calls for imagery.
- Keep homepage components reusable for future hospital, doctor, and appointment pages.
- If backend data is not ready, use the existing safe frontend fallback pattern instead of inventing a new data layer.

## Validation

Use Yarn only:

```bash
yarn install
yarn typecheck
yarn build
```

If `yarn typecheck` is not available, inspect `package.json` and run the closest existing Yarn validation command.
