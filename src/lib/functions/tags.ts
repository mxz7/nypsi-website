import { browser } from "$app/environment";
import { tags } from "$lib/state.svelte";

export type Tag = { tagId: string; emoji: string; name: string };

export async function getTags(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
): Promise<{
  [key: string]: Tag;
}> {
  if (!browser) {
    const tagsData: { [key: string]: Tag } = await fetch("/api/tags").then((r) => r.json());

    return tagsData;
  }

  if (tags.value) return tags.value;

  const tagsData: { [key: string]: Tag } = await fetch("/api/tags").then((r) => r.json());

  tags.value = tagsData;

  return tagsData;
}
