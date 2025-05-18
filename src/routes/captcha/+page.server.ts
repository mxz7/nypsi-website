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

  return {
    id: query.id,
    solved: query.solved,
    rickroll: Math.floor(Math.random() * 100) <= 5,
    authUser: auth.user,
  };
}

export const actions = {
  default: async ({ request, fetch, url, getClientAddress }) => {
    const formData = await request.formData();

    const captchaId = url.searchParams.get("id");
    const token = formData.get("h-captcha-response");

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
      let ip: string;

      try {
        ip = getClientAddress();
      } catch {}

      await prisma.captcha.update({
        where: { id: captchaId },
        data: {
          solved: true,
          solvedAt: new Date(),
          solvedIp: ip,
        },
      });

      return { success: true };
    } else {
      return { success: false };
    }
  },
};
