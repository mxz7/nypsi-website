import { getCommandsData } from "$lib/functions/getCommandsData.js";
import getItems from "$lib/functions/getItems.js";

export const load = async ({ fetch, params }) => {
  const item = (await getItems()).find((i) => i.id === params.type);

  let title = "";
  let suffix: (value: string) => string = () => "";

  const getData = async () => {
    if (item) {
      return fetch(`/api/leaderboard/item/${item.id}`).then((r) => r.json());
    } else if (params.type === "activeusers") {
      return getCommandsData(fetch).then((r) => r?.users.splice(0, 5));
    } else if (params.type === "lottery") {
      return fetch("/api/leaderboard/lottery").then((r) => r.json());
    } else {
      return fetch(`/api/leaderboard/${params.type}`).then((r) => r.json());
    }
  };

  if (item) {
    title = `${item.name} leaderboard`;
    suffix = (value: string) =>
      parseInt(value.replaceAll(",", "")) > 1
        ? item.plural
          ? item.plural
          : item.name + "s"
        : item.name;
  } else {
    switch (params.type) {
      case "balance":
        title = "top balance";
        break;
      case "networth":
        title = "top net worth";
        break;
      case "prestige":
        title = "top prestige";
        break;
      case "wordle":
        title = "top wordle wins";
        suffix = (value) => (parseInt(value) > 1 ? "wins" : "win");
        break;
      case "streak":
        title = "top daily streak";
        break;
      case "lottery":
        title = "top lottery wins";
        suffix = (value) => (parseInt(value) > 1 ? "wins" : "win");
        break;
    }
  }

  return {
    title,
    item,
    suffix,
    streamed: {
      data: getData(),
      tags: fetch("https://raw.githubusercontent.com/tekoh/nypsi/main/data/tags.json")
        .then((r) => r.text())
        .then((r) => JSON.parse(r)),
    },
  };
};
