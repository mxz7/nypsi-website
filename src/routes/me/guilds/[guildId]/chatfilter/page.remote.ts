import { form, getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { getAuthedUser } from "$lib/api/auth.remote";
import { Constants } from "$lib/data/constants";
import { canModifyGuild } from "$lib/functions/discordapi/permissions";
import prisma from "$lib/server/database.js";
import { getGuilds } from "$lib/server/functions/discordapi/guilds.js";
import { error, invalid, redirect } from "@sveltejs/kit";
import z from "zod";

const newFilterSchema = z.object({
  content: z
    .string()
    .toLowerCase()
    .min(1, "filter content too short")
    .max(100, "filter content too long")
    .trim(),
  match: z
    .number()
    .min(1, "must be at least 1% match")
    .max(100, "a percentage can't be more than 100..."),
  guildId: z.string().regex(Constants.SNOWFLAKE_REGEX, "invalid guild"),
});

export const createFilter = form(newFilterSchema, async (data, issue) => {
  const { fetch, locals, url } = getRequestEvent();
  const authedUser = await getAuthedUser();

  if (!authedUser) {
    redirect(302, "/login?next=" + encodeURIComponent(url.href));
  }

  const guilds = await getGuilds(authedUser, locals);

  if (!guilds) error(400, "unknown guilds error");
  if (typeof guilds === "number") error(guilds, "discord api error");

  const guild = guilds.find((g) => g.id === data.guildId);

  if (!guild) redirect(302, "/me/guilds");

  if (!canModifyGuild(guild)) error(403, "you don't have permission to modify this guild");

  if (data.content.normalize("NFD").trim().length === 0) {
    invalid(issue.content("no content"));
  }

  const count = await prisma.chatFilter.count({ where: { guildId: data.guildId } });

  if (count >= 250) {
    invalid(issue.content("you have reached the limit (250)"));
  }

  await prisma.chatFilter
    .create({
      data: {
        guildId: data.guildId,
        content: data.content.normalize("NFD").trim(),
        percentMatch: data.match,
      },
    })
    .catch(() => {
      invalid(issue.content("already exists"));
    });

  await fetch(`${env.BOT_SERVER_URL}/redis`, {
    method: "delete",
    body: `cache:guild:chatfilter:${data.guildId}`,
    headers: { authorization: `Bearer ${env.BOT_API_AUTH}` },
  });

  return { success: true };
});
