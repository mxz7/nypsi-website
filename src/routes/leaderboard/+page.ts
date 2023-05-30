import getBalances from "$lib/functions/getBalances";
import { getTopCommands } from "$lib/functions/getCommandsData.js";
import getItems from "$lib/functions/getItems";

export async function load({ fetch }) {
  const items = await getItems();
  const balance = await getBalances(fetch);
  const commands = await getTopCommands(fetch);

  return {
    items,
    balance: balance as { value: string; username: string; position: string }[],
    commands: commands as { value: string; username: string; position: string }[]
  };
}
