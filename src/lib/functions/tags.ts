import { tags } from "$lib/state.svelte";

export async function getTags(): Promise<{
  [key: string]: { tagId: string; emoji: string; name: string };
}> {
  if (tags.value) return tags.value;

  const res = await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/tags.json")
    .then((r) => r.text())
    .then((r) => JSON.parse(r));

  tags.value = res;

  return res;
}
