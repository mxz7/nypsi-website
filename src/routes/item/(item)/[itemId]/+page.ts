import { browser } from "$app/environment";
import { error } from "@sveltejs/kit";
import { sort } from "fast-sort";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function load({ params, parent, fetch }) {
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
      const arr: { itemId: string; chance: string }[] = [];

      for (const item of selected.items) {
        if (item.split(":")[0] === "id") {
          arr.push({
            itemId: item.split(":")[1],
            chance: (item.split(":")[2] || "100") + "%",
          });
        } else {
          arr.push({
            itemId: item.split(":")[0] + ":" + item.split(":")[1],
            chance: (item.split(":")[2] || "100") + "%",
          });
        }
      }

      odds.crate_open = sort(arr).desc((i) =>
        parseFloat(i.chance.substring(0, i.chance.length - 1)),
      );
    }

    if (selected.random_drop_chance) {
      odds.found["loot drop"] = selected.random_drop_chance + "%";
    }

    for (const item of items) {
      if (item.role === "scratch-card") {
        if (item.items.find((i) => i.split(":")[1] === selected.id)) {
          odds.found[item.id] =
            (item.items.find((i) => i.split(":")[1] === selected.id).split(":")[2] || "100") + "%";
        }
      } else if (item.role === "crate") {
        if (
          item.items?.find((i) => i.split(":")[1] === selected.id) ||
          item.items?.find((i) => i.startsWith("role:") && i.endsWith(selected.role))
        ) {
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

  const inWorld = fetch(`/api/item/inworld/${selected.id}`).then((r) => {
    if (r.status !== 200) return 0;
    return r.json().then((r) => r.count);
  });

  const value = fetch(`/api/item/value/${selected.id}`).then((r) => {
    if (r.status !== 200) return 0;
    return r.json().then((r) => r.value);
  });

  return {
    item: selected,
    odds: browser ? getOddsData() : await getOddsData(),
    inWorld: browser ? inWorld : await inWorld,
    value: browser ? value : await value,
  };
}
