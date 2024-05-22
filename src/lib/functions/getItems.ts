import { browser } from "$app/environment";
import { inPlaceSort } from "fast-sort";
import ms from "ms";
import parseEmoji from "./parseEmoji";

export default async function getItems() {
  if (browser && localStorage.getItem("items")) {
    const data = JSON.parse(localStorage.getItem("items") as string);

    if (data.saved > Date.now() - ms("1 hour"))
      return JSON.parse(localStorage.getItem("items") as string).data as {
        id: string;
        name: string;
        emoji: string;
        aliases: string[];
        role: string;
        plural?: string | undefined;
      }[];
  }

  let items: {
    id: string;
    name: string;
    emoji: string;
    aliases: string[];
    role: string;
    plural?: string;
  }[] = Object.values(
    JSON.parse(
      await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/items.json").then((r) =>
        r.text(),
      ),
    ),
  );

  items = items.filter((i) => !["beginner_booster", "cycle"].includes(i.id));

  for (const item of items) {
    const thumbnail = parseEmoji(item.emoji);

    if (thumbnail) item.emoji = thumbnail;
  }

  inPlaceSort(items).asc((i) => i.name);

  if (browser) localStorage.setItem("items", JSON.stringify({ data: items, saved: Date.now() }));

  return items;
}
