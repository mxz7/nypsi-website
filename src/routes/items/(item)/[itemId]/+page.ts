import { browser } from "$app/environment";
import { getCrateOdds } from "$lib/functions/items.js";
import sleep from "$lib/functions/sleep";
import { error } from "@sveltejs/kit";
import { inPlaceSort } from "fast-sort";

export async function load({ params, parent, fetch, setHeaders }) {
  const [{ items }, crateOdds] = await Promise.all([parent(), getCrateOdds(fetch)]);

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

    if (selected.role === "crate") {
      promises.push(
        fetch(
          `https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/${["vote_crate", "69420_crate"].includes(selected.id) ? "basic_crate" : selected.id}.txt`,
        ).then((response) =>
          response.text().then((text) => {
            const arr: { itemId: string; chance: string }[] = [];

            const lines = text.split("\n");

            for (const line of lines) {
              arr.push({
                itemId: line.split(": ")[0],
                chance: line.split(": ")[1].split("%")[0] + "%",
              });
            }

            odds.crate_open = arr;
          }),
        ),
      );
    } else if (selected.role === "scratch-card") {
      const lootPool = crateOdds[selected.id];

      odds.crate_open = [];

      if (Object.hasOwn(lootPool, "money")) {
        for (const amount in lootPool.money) {
          odds.crate_open.push({ itemId: `money:${amount}`, chance: lootPool.money[amount] + "%" });
        }
      }

      if (Object.hasOwn(lootPool, "xp")) {
        for (const amount in lootPool.xp) {
          odds.crate_open.push({ itemId: `xp:${amount}`, chance: lootPool.xp[amount] + "%" });
        }
      }

      if (Object.hasOwn(lootPool, "karma")) {
        for (const amount in lootPool.karma) {
          odds.crate_open.push({ itemId: `karma:${amount}`, chance: lootPool.karma[amount] + "%" });
        }
      }

      if (Object.hasOwn(lootPool, "items")) {
        for (const item in lootPool.items) {
          const entry = lootPool.items[item];

          if (typeof entry === "number") {
            odds.crate_open.push({ itemId: item, chance: entry + "%" });
          } else {
            odds.crate_open.push({ itemId: item, chance: entry.weight + "%" });
          }
        }
      }

      inPlaceSort(odds.crate_open).desc((i) =>
        parseFloat(i.chance.substring(0, i.chance.length - 1)),
      );
    }

    for (const item of items) {
      if (item.role === "scratch-card") {
        const lootPool = crateOdds[item.id];

        if (Object.hasOwn(lootPool, "items")) {
          const items = lootPool["items"];

          if (items[selected.id]) {
            const entry = items[selected.id];
            if (typeof entry === "number") {
              odds.found[item.id] = entry + "%";
            } else {
              odds.found[item.id] = entry.weight + "%";
            }
          }
        }
      } else if (
        item.role === "crate" ||
        item.id.includes("pickaxe") ||
        item.id.includes("fishing_rod") ||
        item.id.includes("gun")
      ) {
        promises.push(
          fetch(`https://raw.githubusercontent.com/mxz7/nypsi-odds/main/out/${item.id}.txt`)
            .then((response) =>
              response.text().then((text) => {
                const lines = text.split("\n");
                const line = lines.find((i) => i.split(":")[0] === selected.id);

                if (!line) return;

                odds.found[item.id] = line.split(":")[1].split("%")[0].trim() + "%";
              }),
            )
            .catch(() => {}),
        );
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

              odds.found["vote_crate"] = line.split(":")[1].split("%")[0] + "%";
              odds.found["basic_crate"] = line.split(":")[1].split("%")[0] + "%";
              odds.found["69420_crate"] = line.split(":")[1].split("%")[0] + "%";
            }),
        ),
      );
    }

    const randomDrop = crateOdds["random_drop"].items[selected.id];

    if (randomDrop) {
      if (typeof randomDrop === "number") {
        odds.found["loot drop"] = randomDrop + "%";
      } else {
        odds.found["loot drop"] = randomDrop.weight + "%";
      }
    }
    await Promise.all(promises);

    return odds;
  };

  const inWorld = fetch(`/api/items/inworld/${selected.id}`).then((r) => {
    if (r.status !== 200) return 0;
    return r.json().then((r) => r.count);
  });

  const value = fetch(`/api/items/value/${selected.id}`).then((r) => {
    if (r.status !== 200) return 0;
    return r.json().then((r) => r.value);
  });

  const oddsData = getOddsData();

  if (browser) {
    const race = await Promise.race([Promise.all([oddsData, inWorld, value]), sleep(50)]);

    if (typeof race === "boolean") {
      setHeaders({ "x-accel-buffering": "no" });
      return { item: selected, odds: oddsData, inWorld, value };
    }

    return {
      item: selected,
      odds: await oddsData,
      inWorld: await inWorld,
      value: await value,
    };
  }

  return {
    item: selected,
    odds: await getOddsData(),
    inWorld: await inWorld,
    value: await value,
  };
}
