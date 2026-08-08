export const privacyPreferenceSelection = {
  where: { key: "leaderboards" },
  select: { value: true },
  take: 1,
} as const;

export function isPrivate(preferences: readonly { value: unknown }[] | null | undefined) {
  return preferences?.[0]?.value === true;
}
