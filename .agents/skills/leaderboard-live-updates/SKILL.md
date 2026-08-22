---
name: leaderboard-live-updates
description: Explains the Nypsi website/bot Redis contracts and website behavior for live standard, item, and event leaderboard updates. Use when changing leaderboard pub/sub, query.live streaming, channel names, payloads, filtering, identity lookups, or row animations.
---

# Leaderboard Live Updates

The bot publishes value changes and the website applies them only to entities already present in its cached top 100. Slight inaccuracy near the bottom is intentional until the leaderboard cache refreshes.

## Redis contract

Standard leaderboard channel:

```text
nypsi:leaderboard:{leaderboard}
```

Item leaderboard channel:

```text
nypsi:leaderboard:item-{itemId}
```

Payload:

```ts
type LeaderboardUpdateEvent = {
  entityId: string;
  value: string;
  increment?: true;
};
```

`entityId` is the user ID, except for the `guilds` leaderboard where it is the guild name. For ordinary scores, counts, currency, item amounts, ratings, and times, `value` is the unformatted numeric string; times are milliseconds. The unique `level` leaderboard value remains a preformatted string such as `"P2 L47"`. Publish structured messages with the shared Redis serializer.

Omit `increment` to replace the current value. Set `increment: true` to add `value` to the current value for integer aggregate leaderboards such as `commands`. Increment values may be negative. Do not use increment mode for `level`, time, or rating leaderboards.

Except for the unique prestige/level value, the bot does not format display strings. The Svelte component adds currency symbols, thousands separators, guild level labels, rating rounding, and time formatting.

The bot owns privacy filtering. It must not publish updates for private users.

## Website behavior

- `getData` supplies the initial leaderboard rows to the page.
- `getLeaderboardUpdates` in `src/lib/api/leaderboards/updates.remote.ts` subscribes to the selected leaderboard channel with `query.live`.
- The live query reads the cached leaderboard server-side only to build its trusted entity-ID filter. It must not query user or guild identity data.
- The live query's first client message is `{ type: "ready" }`; do not yield the cached leaderboard because `getData` already sent it.
- Ignore events whose `entityId` is not in the cached top 100. Do not fetch or insert outsiders.
- Yield matching raw updates. The component formats the value, re-sorts known rows, recalculates positions, and animates value/rank changes.
- Do not version the leaderboard cache for this feature.

The channel helper and event type live in `src/lib/types/leaderboards.ts`. Callers must add the `item-` namespace before passing an item leaderboard identifier to the channel helper. Standard leaderboard identifiers are defined in `src/lib/api/leaderboards/shared.ts`; any other valid route type is treated as an item ID.

## Event leaderboard

The event leaderboard uses `nypsi:event-progress`. Page data supplies the initial total progress and leaderboard rows. The live query reads the cached event from `getEvent(eventId)` only to initialize its private top-10 filter, converts cached contributions back to BigInt, and first yields `{ type: "ready" }`; do not send those rows to the client again. Every matching event must still be yielded so total progress remains current.

Track the top 10 inside the live query. Redis events contain absolute `userProgress` and `totalProgress` values. For a user outside the top 10, send the client only `{ type: "update", totalProgress }`. For an existing top-10 user, also send `userId` and `userProgress`; the client reuses identity from its current row. For a user newly entering the top 10, additionally send their username and avatar. Compare unknown users with the current tenth-place contribution and query identity only when they can enter; treat an equal contribution as eligible because username is the tie-breaker.
