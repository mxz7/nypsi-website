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

## Charts

Use `src/lib/components/chart.svelte` (LayerChart) with the serializable `ChartData` / `ChartOptions` types in `src/lib/types/chart.ts`. Data functions return flat `labels` and `series`; formatting callbacks belong in components. Give the chart an explicitly sized parent (e.g. `h-80`), since it fills the available height. Use `sparkline: true` for noninteractive charts without axes or legends.

`prepareChart` aligns series by X, preserves null gaps and raw tooltip values, and normalizes independent left/right axes into shared plot coordinates. LayerChart appends mark-specific arrays to `flatData`, so multi-array charts use `quadtree-x` and resolve hovered X back to the aligned row for tooltips. Import SVG variants from `layerchart/svg`; style marks with camelCase `strokeWidth` / `fillOpacity` props. Size Y-axis padding from the formatted ticks instead of a fixed gutter; anchor the first/last X labels inward so they stay inside the plot. Chart marks reveal together from left to right in a CSS-clipped group keyed by `chartData`, so loading fresh data replays it while legend toggles do not. The animation only runs with `prefers-reduced-motion: no-preference`. Version caches when changing serialized chart shapes.
