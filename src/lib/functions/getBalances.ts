export const prerender = false;

export default async function getBalances(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
  const data: { value: string; username: string; position: string }[] | { error: string } = await fetch(
    "/api/leaderboard/balance"
  ).then((r) => r.json());

  if (!Array.isArray(data)) return null;

  return data as { value: string; username: string; position: string }[];
}
