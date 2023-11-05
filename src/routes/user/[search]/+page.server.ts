import getItems from "$lib/functions/getItems.js";
import prisma from "$lib/server/database.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ params, fetch, setHeaders }) => {
  setHeaders({
    "cache-control": "s-maxage=300",
  });

  const search = params.search;
  let userId: string;

  if (!search) throw redirect(302, "/user/unknown");

  if (search.match(/^\d{17,19}$/)) {
    userId = search;

    const res = await fetch(`/api/user/check/${userId}`).then((r) => r.json());

    if (!res.exists) throw redirect(302, `/user/unknown?user=${search}`);
    if (res.private) throw redirect(302, "/user/private");
  } else {
    const res = await fetch(`/api/user/getid/${search}`).then((r) => r.json());

    if (res.id) {
      userId = res.id;
    } else {
      throw redirect(302, `/user/unknown?user=${search}`);
    }
  }

  return {
    baseUserData: prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        avatar: true,
        blacklisted: true,
        lastCommand: true,
        id: true,
        lastKnownUsername: true,
        Tags: {
          select: {
            selected: true,
            tagId: true,
          },
        },
        Premium: {
          select: {
            level: true,
          },
        },
      },
    }),
    items: getItems(),
    streamed: {
      tagData: fetch("https://raw.githubusercontent.com/tekoh/nypsi/main/data/tags.json")
        .then((r) => r.text())
        .then((r) => JSON.parse(r)),
      allUserData: fetch(`/api/user/${userId}`).then((r) => r.json()),
    },
  };
};
