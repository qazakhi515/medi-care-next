Now make Community page responsive.

File:

- community/index.tsx

Current problem:

- Mobile version is only a placeholder: <h1>COMMUNITY PAGE MOBILE</h1>
- Replace this placeholder with the real Community page UI adapted for mobile.

Requirements:

- Keep desktop version unchanged.
- Do not modify Home, Hospitals, Doctors, or Appointments pages.
- Use the existing Community desktop data and UI structure.
- On mobile, posts/cards/lists must fit inside the screen.
- Cards must not overlap or overflow.
- If there are multiple cards in one row, make them vertical or horizontally scrollable.
- Buttons, tabs, search/filter areas must fit mobile width.
- Text size and section padding should be adjusted for mobile.
- Images/icons must use max-width: 100%.
- Add responsive CSS using @media (max-width: 768px).
- Run npm run build and fix errors if they appear.
