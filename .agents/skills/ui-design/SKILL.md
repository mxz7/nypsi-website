---
name: ui-design
description: Apply established nypsi-website UI patterns. Use when creating or reviewing Svelte components, cards, profile tabs, tables, history views, empty states, status badges, or pagination controls.
---

# UI Design

Match nearby interfaces before introducing a new pattern. Reuse daisyUI and the shared `Card` component, then make responsive behavior explicit.

## History tables

- Wrap standalone tables in `Card` with `mode="section"` and horizontal overflow.
- Use an `h2` with `mb-4 flex items-center gap-2 text-xl font-bold`; put a Lucide icon in `rounded-box bg-base-300 p-2` with `text-primary`.
- Use fixed widths for compact columns and let the primary content column fill remaining space. Wrap long content rather than widening every row.
- Use soft semantic badges with readable colors. Do not use `badge-neutral` for an inactive status if the theme renders it low-contrast.
- Show empty results as a centered, muted sentence with vertical padding.
- For incremental history, fetch 25 rows per page and use a full-width `btn btn-soft` load-more control; disable it while loading or complete.

## Profile tabs

- Keep the existing horizontal `menu` and query-parameter navigation.
- Render restricted tabs only for authorized viewers and enforce the same authorization in the data function.
- Fetch tab-specific data in its component rather than expanding the profile base-data query.
