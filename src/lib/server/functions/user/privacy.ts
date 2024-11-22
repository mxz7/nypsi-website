import type { APIUserCheck } from "$lib/types/api/UserCheck";
import { error } from "@sveltejs/kit";

export async function privacyCheck(
  userId: string,
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) {
  const privacyCheck: APIUserCheck = await fetch(`/api/user/check/${userId}`).then((r) => r.json());

  if (!privacyCheck?.ok || !privacyCheck.exists) return error(404, "user not found");
  if (privacyCheck.private) return error(403, "user has a private profile");
  return "continue";
}
