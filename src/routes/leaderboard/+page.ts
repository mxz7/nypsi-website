import { inPlaceSort } from "fast-sort";
import { parse } from "twemoji-parser";

export async function load() {
  const items: { id: string; name: string; emoji: string; aliases: string[] }[] = Object.values(
    JSON.parse(await fetch("https://raw.githubusercontent.com/tekoh/nypsi/main/data/items.json").then((r) => r.text()))
  );

  for (const item of items) {
    let thumbnail = "";

    if (item.emoji.split(":")[2]) {
      const emojiID = item.emoji.split(":")[2].slice(0, item.emoji.split(":")[2].length - 1);

      thumbnail = `https://cdn.discordapp.com/emojis/${emojiID}`;

      if (item.emoji.split(":")[0].includes("a")) {
        thumbnail = thumbnail + ".gif";
      } else {
        thumbnail = thumbnail + ".png";
      }
    } else {
      try {
        thumbnail = parse(item.emoji, { assetType: "png" })[0].url;
      } catch {
        /* happy linter */
      }
    }

    if (thumbnail) item.emoji = thumbnail;
  }

  inPlaceSort(items).asc((i) => i.name);

  return { items };
}
