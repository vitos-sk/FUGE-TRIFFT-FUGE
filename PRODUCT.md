# Product

## Register

product

## Users

**Admin (Inhaber / Betriebsleiter):** The business owner or foreman. Works from a desktop or mobile. Needs to see at a glance who's working where, how many hours were logged this week, and what the wage costs are. Manages objects (jobs), assigns workers, exports reports.

**Workers (Fliesenleger):** Tile installers on job sites. Use the app on a phone, often outdoors in poor light or with dirty hands. Core task: log hours for the day as fast as possible. No patience for multi-step flows or decorative UI.

## Product Purpose

Internal operations CRM for a German tile installation company ("Fuge trifft Fuge"). Replaces paper timesheets and phone calls. Workers log hours per construction object; admin sees stats, manages users, exports Excel reports. Success = the app stays out of the way and data is always correct.

## Brand Personality

Praktisch · Schnell · Klar (Practical · Fast · Clear)

A professional trade tool — not a consumer product, not a startup. The visual language should feel like a precision instrument built for construction-site conditions: high contrast, zero distraction, immediate feedback.

## Anti-references

- **Salesforce / enterprise CRM**: Bloated, table-heavy, grey office aesthetic — this is a small crew, not a corporation.
- **Notion / Trello**: Playful, pastel, drag-and-drop — workers don't want a "workspace", they want to clock in.
- **SaaS startup (green/purple gradients, glassmorphism, cream bg)**: Decorative and trust-signalling for investors, not for a tile foreman.
- **Construction retail (IKEA/OBI yellow, big product tiles)**: Retail energy, not operational precision.

## Design Principles

1. **Speed over completeness** — every primary action (log hours, change status) must be reachable in 1–2 taps, never behind modals-of-modals.
2. **Dark = professional** — the dark theme is not aesthetic; it's legible on a bright job site and battery-friendly on mobile. Never abandon it.
3. **Numbers are the product** — hours, wages, counts. Typography and spacing should frame numbers prominently; text is secondary.
4. **Zero decoration debt** — any visual element that doesn't carry information or guide action should not exist. No gradients as aesthetics, no illustrations, no bloat.
5. **Mobile-first, admin-second** — workers are always on phones; the admin dashboard can tolerate desktop-only complexity.

## Accessibility & Inclusion

WCAG AA contrast minimum. No screen-reader requirements specified, but semantic HTML and visible focus states are expected. `prefers-reduced-motion` should be respected.
