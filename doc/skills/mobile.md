I have a React/Next.js MEDI-CARE project. Desktop version is finished.
Mobile version is incomplete except Home page.

Please make the whole website responsive for mobile without breaking desktop.

Pages to fix:

- Home
- Hospitals
- Doctors
- Appointments
- Community
- CS / Customer Support

Main problems:

1. Navbar menu buttons overlap on mobile.
2. Menu items should scroll horizontally on mobile.
3. Cards overlap or go outside the screen.
4. Cards should be swipeable / horizontally scrollable on mobile where needed.
5. Search input and Search button should fit inside mobile screen.
6. Page sections should have proper mobile padding.
7. Text sizes should be reduced for mobile.
8. Images should not overflow.
9. Forms and buttons should be full-width or properly aligned on mobile.
10. Tables/lists should not break layout.

Rules:

- Do not rewrite the whole project.
- Do not change desktop design.
- Add responsive CSS using media queries.
- Use max-width: 768px for mobile.
- Prefer flex-wrap, overflow-x: auto, scroll-snap, width: 100%, max-width: 100%.
- Remove/fix fixed widths, fixed heights, large margins, absolute positioning problems only when they break mobile.
- Keep existing class names and component structure as much as possible.

Expected result:

- All pages should look clean on mobile.
- No horizontal overflow except intentional swipe sections.
- Navbar should be usable on mobile.
- Cards should be scrollable/swipeable.
- Buttons should not overlap.
- Desktop version should remain unchanged.
