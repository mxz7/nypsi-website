import { getCommandsData } from "$lib/functions/getCommandsData.js";
import getItems from "$lib/functions/getItems.js";

export const load = async ({ fetch, params }) => {
  const item = (await getItems()).find((i) => i.id === params.type);

  let title = "";

  const getData = async () => {
    if (item) {
      return fetch(`/api/leaderboard/item/${item.id}`);
    } else if (params.type === "activeusers") {
      return getCommandsData(fetch).then((r) => r?.users.splice(0, 5));
    } else {
      return fetch(`/api/leaderboard/${params.type}`);
    }
  };

  if (item) {
    title = `${item.plural ? item.plural : item.name} leaderboard`;
  } else if (params.type === "activeusers") {
    title = "top active users";
    // suffix = (value) => (parseInt(value) > 1 ? "cmds" : "cmd");
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
        break;
      case "streak":
        title = "top daily streak";
        break;
    }
  }

  const testStream = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, 3000);
    });
  };

  return { title, item, test: testStream() };
};
