## Doctor Detail Page Enhancement

Before editing, read `AGENTS.md`.

Task: Enhance only the doctor detail page opened from `/doctors/:id`.

Requirements:

- Do not change unrelated pages, routes, APIs, layouts, or business logic.
- Preserve existing website design and current functionality.
- Use minimal, safe code changes.
- Reuse existing components when possible.
- Use dynamic doctor data only; do not hardcode doctor-specific content.

Doctor detail page must include:

1. Doctor Introduction

   - doctor photo
   - full name
   - specialty
   - short professional bio
   - experience years if available

2. Education

   - university / medical school
   - degree
   - graduation year if available

3. Work Experience

   - previous and current workplaces
   - position / role
   - years if available

4. Photo Animation

   - Add a light animation to the doctor image.
   - Use Framer Motion if already available in the project.
   - Otherwise use simple CSS animation.
   - Animation must be subtle, professional, and not distracting.

5. Background Style
   - Add a soft background color/gradient matching the website brand colors.
   - Keep good contrast and readability.
   - Do not break mobile responsiveness.

Implementation mode:

- Token-efficient.
- Smallest safe diff.
- No unnecessary refactoring.
