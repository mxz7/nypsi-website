import { form, getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { Constants } from "$lib/data/constants";
import { requireGuildAccess } from "$lib/server/functions/discordapi/guild-access";
import { invalid } from "@sveltejs/kit";
import z from "zod";

const prefixSchema = z
  .array(
    z
      .string()
      .min(1, "prefixes cannot be empty")
      .max(3, "prefixes cannot be longer than 3 characters")
      .refine((prefix) => !/[\s`*_]/.test(prefix), "prefix contains an illegal character"),
  )
  .min(1, "at least one prefix is required")
  .max(5, "you can have a maximum of 5 prefixes")
  .refine((prefixes) => new Set(prefixes).size === prefixes.length, "prefixes must be unique");

const settingsSchema = z.object({
  altPunish: z.enum(["true", "false"]),
  disabledChannels: z.string(),
  guildId: z.string().regex(Constants.SNOWFLAKE_REGEX, "invalid guild"),
  prefixes: z.string(),
  slashOnly: z.enum(["true", "false"]),
});

const modlogsSchema = z.object({
  channelId: z.union([z.literal(""), z.string().regex(Constants.SNOWFLAKE_REGEX)]),
  guildId: z.string().regex(Constants.SNOWFLAKE_REGEX, "invalid guild"),
});

async function updateBot(path: string, body: object) {
  const { fetch } = getRequestEvent();
  const response = await fetch(`${env.BOT_SERVER_URL}${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      authorization: `Bearer ${env.BOT_API_AUTH}`,
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    invalid(result?.error ?? "unable to update server settings");
  }
}

export const saveGuildSettings = form(settingsSchema, async (data, issue) => {
  await requireGuildAccess(data.guildId);

  let rawDisabledChannels: unknown;
  let rawPrefixes: unknown;

  try {
    rawDisabledChannels = JSON.parse(data.disabledChannels);
  } catch {
    invalid(issue.disabledChannels("invalid disabled channels"));
  }

  try {
    rawPrefixes = JSON.parse(data.prefixes);
  } catch {
    invalid(issue.prefixes("invalid prefixes"));
  }

  const disabledChannels = z
    .array(z.string().regex(Constants.SNOWFLAKE_REGEX))
    .safeParse(rawDisabledChannels);
  const prefixes = prefixSchema.safeParse(rawPrefixes);

  if (!disabledChannels.success) invalid(issue.disabledChannels("invalid disabled channels"));
  if (!prefixes.success) invalid(issue.prefixes(prefixes.error.issues[0].message));

  await updateBot(`/guilds/${data.guildId}/settings`, {
    altPunish: data.altPunish === "true",
    disabledChannels: disabledChannels.data,
    prefixes: prefixes.data,
    slashOnly: data.slashOnly === "true",
  });

  return { success: true };
});

export const saveModlogs = form(modlogsSchema, async (data) => {
  await requireGuildAccess(data.guildId);
  await updateBot(`/guilds/${data.guildId}/modlogs`, {
    channelId: data.channelId || null,
  });

  return { success: true };
});
