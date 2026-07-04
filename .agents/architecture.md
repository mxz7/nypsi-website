# Architecture Notes

## User Profile Tabs

Avoid expanding `getBaseData` for guild details on the user profile page. Fetch guild data via a dedicated remote function in `src/lib/api/guilds.remote.ts` and call it from the guild tab component directly.
