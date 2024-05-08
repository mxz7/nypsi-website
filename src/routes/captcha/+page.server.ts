import { HCAPTCHA_SECRET } from "$env/static/private";
import { PUBLIC_HCAPTCHA_SITEKEY } from "$env/static/public";
import prisma from "$lib/server/database.js";
import { error } from "@sveltejs/kit";

export async function load({ url }) {
  const id = url.searchParams.get("id");

  if (!id) return error(404, "Not found");

  const query = await prisma.captcha.findUnique({
    where: { id },
    select: { id: true, solved: true },
  });

  if (!query) return error(404, "Not found");

  await prisma.captcha.update({
    where: { id },
    data: {
      visits: { push: new Date() },
    },
  });

  return { id: query.id, solved: query.solved };
}

export const actions = {
  default: async ({ request, fetch, url }) => {
    const formData = await request.formData();
    const id = url.searchParams.get("id");

    const token = formData.get("token");

    const body = new URLSearchParams({
      secret: HCAPTCHA_SECRET,
      response: token as string,
      sitekey: PUBLIC_HCAPTCHA_SITEKEY,
    });

    const res = await fetch("https://hcaptcha.com/siteverify", {
      method: "post",
      credentials: "omit",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
    }).then((r) => r.json());

    if (res.success) {
      await prisma.captcha.update({
        where: { id },
        data: {
          solved: true,
          solvedAt: new Date(),
        },
      });

      return { success: true };
    } else {
      return { success: false };
    }
  },
};
