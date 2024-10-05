import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "public, max-age=300, must-revalidate",
  });

  const query = await prisma.economyGuild
    .findMany({
      select: {
        guildName: true,
        level: true,
      },
      orderBy: [{ level: "desc" }, { xp: "desc" }, { balance: "desc" }, { guildName: "asc" }],
      take: 100,
    })
    .then((r) => {
      let count = 0;

      return r.map((x) => {
        count++;
        return {
          value: `level ${x.level}`,
          user: {
            username: x.guildName,
            id: x.guildName,
          },
          position: count,
        };
      });
    });

  return json(query);
}
