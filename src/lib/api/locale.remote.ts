import { getRequestEvent, query } from "$app/server";

function normalizeLocale(locale: string | null | undefined): string | null {
  if (!locale) return null;

  try {
    const normalized = Intl.getCanonicalLocales(locale);
    return normalized[0] ?? null;
  } catch {
    return null;
  }
}

export const getUserLocale = query(async () => {
  const { request } = getRequestEvent();

  const header = request.headers.get("accept-language");

  if (!header) return "en-US";

  const candidates = header
    .split(",")
    .map((value) => value.split(";")[0]?.trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);
    if (normalized) return normalized;
  }

  return "en-US";
});
