Now fix Login mobile page.

File:

- login/index.tsx
- or the component where "LOGIN MOBILE" text is rendered

Current problem:

- Mobile version shows placeholder text: LOGIN MOBILE
- Replace this placeholder with the real Login UI adapted for mobile.

Requirements:

- Keep desktop login design unchanged.
- Do not modify unrelated pages.
- Reuse existing login form, validation, API logic, and auth logic.
- On mobile, login form must be centered and fit screen width.
- Inputs should be width: 100%.
- Login button should be full-width.
- Logo/title spacing should be mobile-friendly.
- Remove the "LOGIN MOBILE" placeholder text.
- Avoid horizontal overflow.
- Use @media (max-width: 768px).
- Run npm run build and fix errors.
