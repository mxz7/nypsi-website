import prisma from "$lib/server/database.js";
import { getGuilds } from "$lib/server/functions/discordapi/guilds.js";
import { error, redirect } from "@sveltejs/kit";
import { fail, message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { number, object, string } from "zod";

const newFilterSchema = object({
  content: string().toLowerCase().min(1).max(100).trim(),
  match: number().min(1).max(100).default(100),
});

export async function load({ parent, params }) {
  const parentData = await parent();
  if (!parentData.guilds) return redirect(302, "/me");

  const guild = parentData.guilds.find((g) => g.id === params.guildId);

  if (!guild) return redirect(302, "/me/guilds");

  const hasPermission = (parseInt(guild.permissions) & 0x20) == 0x20;

  if (!hasPermission) return redirect(302, "/me/guilds");

  const query = prisma.chatFilter.findMany({
    where: {
      guildId: guild.id,
    },
    select: {
      content: true,
      percentMatch: true,
    },
  });

  return {
    guild,
    filter: await query,
    newFilterForm: await superValidate(zod(newFilterSchema)),
  };
}

export const actions = {
  create: async ({ request, params, locals }) => {
    const auth = await locals.validate();

    if (!auth.user) return redirect(302, "/login?next=" + encodeURIComponent(request.url));

    const guilds = await getGuilds(auth.user, locals);

    if (!guilds) return error(400, "unknown guilds error");

    if (typeof guilds === "number") return error(guilds, "discord api error");

    const guild = guilds.find((g) => g.id === params.guildId);

    if (!guild) return redirect(302, "/me/guilds");

    const form = await superValidate(request, zod(newFilterSchema));

    if (!form.valid) return fail(400, { form });

    await prisma.chatFilter
      .create({
        data: {
          guildId: params.guildId,
          content: form.data.content,
          percentMatch: form.data.match,
        },
      })
      .catch(() => {
        setError(form, "content", "already exists");
      });

    if (!form.valid) return fail(400, { form });

    return message(form, "success");
  },
  delete: async ({ request, params, locals }) => {
    const auth = await locals.validate();

    if (!auth.user) return redirect(302, "/login?next=" + encodeURIComponent(request.url));

    const guilds = await getGuilds(auth.user, locals);

    if (!guilds) return error(400, "unknown guilds error");

    if (typeof guilds === "number") return error(guilds, "discord api error");

    const guild = guilds.find((g) => g.id === params.guildId);

    if (!guild) return redirect(302, "/me/guilds");

    const formData = await request.formData();

    const content = formData.get("content")?.toString();

    if (!content) return fail(400);

    await prisma.chatFilter.delete({
      where: {
        guildId_content: {
          content,
          guildId: params.guildId,
        },
      },
    });
  },
};
