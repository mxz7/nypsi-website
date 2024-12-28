import prisma from "$lib/server/database.js";
import { redirect } from "@sveltejs/kit";
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
  default: async ({ request, params }) => {
    const form = await superValidate(request, zod(newFilterSchema));
    console.log("a");

    if (!form.valid) return fail(400, { form });

    console.log("b");

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

    console.log("c");

    if (!form.valid) return fail(400, { form });

    console.log("d");

    return message(form, "success");
  },
};
