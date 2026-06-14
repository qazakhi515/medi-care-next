---
name: medical-ai-chat-ui
description: Build the Medi-care frontend AI chat UI for safe patient medical questions using the backend askMedicalAi GraphQL mutation.
---

# Medi-care Medical AI Chat UI

Use this skill when implementing or reviewing the patient-facing AI assistant UI.

## Read First

- Read frontend `AGENTS.md`.
- Read `Medi-care/docs/ai`, especially `FRONTEND_MIGRATION.md`, `BACKEND_MIGRATION.md`, and `DECISIONS.md`.
- Preserve the current Next.js architecture and Apollo integration.

## UI Goal

Create a calm patient-facing AI chat experience where users can ask symptom or illness-related questions and receive safe general guidance, urgency level, suggested doctor specialization, and appointment direction.

## GraphQL Contract

Use this mutation:

```graphql
mutation AskMedicalAi($input: MedicalAiInput!) {
	askMedicalAi(input: $input) {
		answer
		urgencyLevel
		suggestedSpecialization
		shouldBookAppointment
		safetyNotice
	}
}
```

Variables:

```json
{
	"input": {
		"message": "patient question",
		"language": "uz"
	}
}
```

## Review Checklist

- Use existing Apollo client patterns; do not add a new data layer.
- Require logged-in patient auth where the current app pattern requires it.
- Show `answer` as the main AI response and `safetyNotice` as a visible small disclaimer.
- Surface `urgencyLevel` clearly:
  - `EMERGENCY`: prominent warning and emergency-care guidance.
  - `HIGH`: strong doctor appointment CTA.
  - `MEDIUM` / `LOW`: normal guidance.
- If `suggestedSpecialization` exists, show it as a doctor search/filter suggestion.
- If `shouldBookAppointment` is true, show a `Book Appointment` CTA that routes to doctor search or appointment flow.
- Do not present AI output as a diagnosis.
- Do not show medication dosage or treatment claims as official medical advice.
- Keep styling consistent with the clinic-style homepage direction: calm colors, white space, readable text, and mobile-safe layout.
- Run Yarn validation after implementation.

## Suggested UI Shape

- Chat entry card or page section.
- Message input with send button and loading state.
- Response card with answer, urgency badge, specialization chip, safety notice, and appointment CTA.
- Empty state examples for common questions.
- Error state for AI/backend failure.
