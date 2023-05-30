export const prerender = false;

export default async function getItem(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
  itemId: string
) {
  const data: { value: string; username: string; position: string }[] | { error: string } = await fetch(
    "/api/leaderboard/item/" + itemId
  ).then((r) => r.json());

  if (!Array.isArray(data)) return null;

  return data as { value: string; username: string; position: string }[];
}
