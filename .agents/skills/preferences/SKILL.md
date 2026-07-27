---
name: preferences
description: Explains how nypsi's sparse key-value preferences must be queried by the website, especially the privacy preference. Use when reading Preferences or deciding whether to expose a user.
---

# Preferences

`Preferences` has a composite `(userId, key)` primary key and a JSON value. Rows only exist when a value differs from its application default.

Use `privacyPreferenceSelection` and `isPrivate()` from `src/lib/server/preferences.ts` for Prisma relation queries. The `leaderboards` preference defaults to `true`, meaning private; an explicit JSON boolean `false` makes the user public. Missing or malformed values must remain private.

Raw SQL must join on both `userId` and `key = 'leaderboards'`. Resolve a missing value to JSON boolean `true`, for example:

```sql
COALESCE(p."value", 'true'::jsonb) = 'true'::jsonb AS privacy
```
