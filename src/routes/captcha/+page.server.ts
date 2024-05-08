import { HCAPTCHA_SECRET } from "$env/static/private";
import { PUBLIC_HCAPTCHA_SITEKEY } from "$env/static/public";

export const actions = {
  captcha: async ({ request, fetch }) => {
    const formData = await request.formData();

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

    console.log(res);
  },
};
