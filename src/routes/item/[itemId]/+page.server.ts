import { BOT_SERVER_URL } from "$env/static/private";
import prisma from "$lib/server/database.js";
import { error } from "@sveltejs/kit";

export const config = {
  isr: {
    expiration: 3600,
  },
};

export async function load({ params, parent, isDataRequest, fetch }) {
  const { items } = await parent();

  const selected = items.find((i) => i.id === params.itemId);

  if (!selected) {
    return error(404, "item not found");
  }

  const getOddsData = async () => {
    const odds: {
      crate_open?: { itemId: string; chance: string }[];
      found: { [key: string]: string };
    } = { found: {} };

    const promises = [];

    if (selected.random_drop_chance) {
      odds.found["loot drop"] = selected.random_drop_chance + "%";
    }

    for (const item of items) {
      if (item.role === "scratch-card") {
        if (item.items.find((i) => i.split(":")[1] === selected.id)) {
          odds.found[item.id] =
            item.items.find((i) => i.split(":")[1] === selected.id).split(":")[2] + "%";
        }
      } else if (item.role === "crate") {
        if (item.items?.find((i) => i.split(":")[1] === selected.id)) {
          promises.push(
            fetch(`https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/${item.id}.txt`).then(
              (response) =>
                response.text().then((text) => {
                  const lines = text.split("\n");
                  const line = lines.find((i) => i.split(":")[0] === selected.id);

                  if (!line) return;

                  odds.found[item.id] = line.split(":")[1].split("%")[0] + "%";
                }),
            ),
          );
        }
      }
    }

    if (selected.in_crates) {
      promises.push(
        fetch("https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/basic_crate.txt").then(
          (response) =>
            response.text().then((text) => {
              const lines = text.split("\n");
              const line = lines.find((i) => i.split(":")[0] === selected.id);

              if (!line) return;

              odds.found["basic_crate"] = line.split(":")[1].split("%")[0] + "%";
            }),
        ),
      );
    }

    await Promise.all(promises);

    return odds;
  };

  const inWorld = prisma.inventory.aggregate({
    _sum: { amount: true },
    where: { item: selected.id },
  });

  const value = fetch(`${BOT_SERVER_URL}/item/value/${selected.id}`).then((r) => {
    if (r.ok) return r.json().then((r) => r.value as number);
    else return 0;
  });

  return {
    item: selected,
    odds: isDataRequest ? getOddsData() : await getOddsData(),
    inWorld: isDataRequest ? inWorld : await inWorld,
    value: isDataRequest ? value : await value,
  };
}
