import { browser } from "$app/environment";
import { tags } from "$lib/state.svelte";

export type Tag = { tagId: string; emoji: string; name: string };

export async function getTags(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
): Promise<{
  [key: string]: Tag;
}> {
  if (!browser) {
    const tagsData: { [key: string]: Tag } = JSON.parse(
      await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/items.json").then((r) =>
        r.text(),
      ),
    );

    return tagsData;
  }

  if (tags.value) return tags.value;

  const tagsData: { [key: string]: Tag } = JSON.parse(
    await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/items.json").then((r) =>
      r.text(),
    ),
  );

  tags.value = tagsData;

  return tagsData;
}
