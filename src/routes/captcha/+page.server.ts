import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import prisma from "$lib/server/database.js";
import { error, redirect } from "@sveltejs/kit";

export async function load({ url, locals }) {
  const auth = await locals.validate();

  if (!auth)
    return redirect(
      302,
      `/login?next=${encodeURIComponent(url.pathname + "?" + url.searchParams.toString())}`,
    );

  const id = url.searchParams.get("id");

  if (!id) return error(400, "Invalid Captcha");

  const query = await prisma.captcha.findUnique({
    where: { id },
    select: { id: true, solved: true, userId: true },
  });

  if (!query) return redirect(302, "/");

  if (query.userId !== auth.user.id)
    return error(401, "Not Authorised - are you logged into the correct account?");

  if (!query.solved)
    await prisma.captcha.update({
      where: { id },
      data: {
        visits: { push: new Date() },
      },
    });

  return { id: query.id, solved: query.solved, rickroll: Math.floor(Math.random() * 100) <= 5 };
}

export const actions = {
  default: async ({ request, fetch, url }) => {
    const formData = await request.formData();
    const id = url.searchParams.get("id");

    const token = formData.get("token");

    const body = new URLSearchParams({
      secret: env.HCAPTCHA_SECRET,
      response: token as string,
      sitekey: publicEnv.PUBLIC_HCAPTCHA_SITEKEY,
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
