---
name: architecture
description: UI architecture patterns for nypsi-website, e.g. how to fetch guild data for the user profile page tabs. Use when working on the user profile page or deciding how a UI section should fetch its data.
---

# Architecture Notes

## User Profile Tabs

Avoid expanding `getBaseData` for guild details on the user profile page. Fetch guild data via a dedicated remote function in `src/lib/api/guilds.remote.ts` and call it from the guild tab component directly.
