import { browser } from "$app/environment";
import { getCrateOdds } from "$lib/functions/items.js";
import sleep from "$lib/functions/sleep";
import { error } from "@sveltejs/kit";

export async function load({ params, parent, fetch, setHeaders }) {
  const [{ items }, crateOdds] = await Promise.all([parent(), getCrateOdds(fetch)]);

  const selected = items.find((i) => i.id === params.itemId);

  if (!selected) {
    return error(404, "item not found");
  }

  const oddsData: Promise<{
    crate_open?: {
      itemId: string;
      chance: string;
    }[];
    found: {
      [key: string]: string;
    };
  }> = fetch(`/api/items/obtaining/${selected.id}`).then((r) => {
    if (r.status !== 200) return { found: {} };
    return r.json();
  });

  const inWorld = fetch(`/api/items/inworld/${selected.id}`).then((r) => {
    if (r.status !== 200) return 0;
    return r.json().then((r) => r.count);
  });

  const value = fetch(`/api/items/value/${selected.id}`).then((r) => {
    if (r.status !== 200) return 0;
    return r.json().then((r) => r.value);
  });

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
    odds: await oddsData,
    inWorld: await inWorld,
    value: await value,
  };
}
