import { Constants } from "$lib/data/constants";
import { error } from "@sveltejs/kit";
import { getAuthedUser } from "./auth.remote";
import { getPrivacy, getUserId } from "./users.remote";

export async function getUserIdHelper(userId: string) {
  if (!userId.match(Constants.SNOWFLAKE_REGEX)) {
    const result = await getUserId(userId);

    if (!result.ok) {
      const { status, message } = result as ApiErrorResult;
      error(status, message);
    }

    userId = result.id;
  }

  return userId;
}

/**
 *
 * @param userId the id of the user to check privacy for
 * @throws 403 if the profile is private and the authed user is not the user or an admin
 * @returns void if the profile is public or the authed user is the user or an admin
 */
export async function checkPrivacyHelper(userId: string) {
  const privacy = await getPrivacy(userId);

  if (privacy) {
    const authedUser = await getAuthedUser();

    if (!authedUser || (authedUser.adminLevel < 1 && authedUser.id !== userId)) {
      error(403, "private profile");
    }
  }
}
