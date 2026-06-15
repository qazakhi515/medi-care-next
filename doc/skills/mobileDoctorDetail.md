Now make Doctor Detail page responsive.

File:

- doctor/detail.tsx (or the doctor detail page component currently used by routing)

Current problem:

- Mobile version is incomplete or not properly responsive.
- Replace any mobile placeholder with the real Doctor Detail UI adapted for mobile.

Requirements:

- Keep desktop version unchanged.
- Do not modify Home, Hospitals, Doctors list, Appointments, Community, CS, or Hospital Detail pages.
- Reuse existing Doctor Detail data, API calls, and UI structure.
- Show doctor profile image, name, specialty, experience, rating, hospital information, schedule, about section, reviews, and appointment actions in a clean mobile layout.
- All sections must fit within the mobile screen width.
- Cards and sections must stack vertically on mobile.
- Images must use width: 100% and max-width: 100%.
- Buttons should be full-width or properly aligned.
- Text sizes, spacing, and padding should be optimized for mobile.
- Tabs, reviews, schedules, and related doctor cards must not overflow the screen.
- If horizontal card scrolling is needed, use overflow-x: auto and scroll-snap.
- Remove layout issues caused by fixed widths, fixed heights, large margins, or absolute positioning.
- Add responsive CSS using @media (max-width: 768px).
- Prevent horizontal overflow.
- Preserve all existing functionality and business logic.
- Run npm run build after changes and fix any build/type errors.
- Ensure the page works correctly on 375px, 390px, 412px, and 430px screen widths.

Expected result:

- Doctor Detail page should be fully usable on mobile.
- No overlapping elements.
- No content cut off.
- Desktop design must remain unchanged.
