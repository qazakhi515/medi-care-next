## Animated Appointment Icon

Task: Add a subtle animated effect to the appointment/booking icon only.

Requirements:
- Do not change unrelated pages, layouts, APIs, or business logic.
- Keep the existing icon design.
- Add a light alarm-like animation:
  - small left-right shake
  - soft scale pulse
  - optional glow/ring effect
- Use Framer Motion if available.
- Animation should loop smoothly.
- Duration: 1.5s–2s per loop.
- Keep it professional, not distracting.
- Must work on mobile and desktop.

Example motion style:
- rotate: [ -2, 2, -2, 0 ]
- scale: [ 1, 1.05, 1 ]
- transition: repeat Infinity, easeInOut
