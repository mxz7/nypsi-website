import getBalances from "$lib/functions/getBalances";
import { getTopCommands } from "$lib/functions/getCommandsData.js";
import getItems from "$lib/functions/getItems";
import getPrestiges from "$lib/functions/getPrestiges.js";

export async function load({ fetch }) {
  const items = await getItems();
  const balance = await getBalances(fetch);
  const commands = await getTopCommands(fetch);
  const prestiges = await getPrestiges(fetch);

  return {
    items,
    prestige: prestiges as { value: string; username: string; position: string }[],
    balance: balance as { value: string; username: string; position: string }[],
    commands: commands as { value: string; username: string; position: string }[]
  };
}
