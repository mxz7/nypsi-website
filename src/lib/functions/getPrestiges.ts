export const prerender = false;

export default async function getPrestiges(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
  const data: { value: string; username: string; position: string }[] | { error: string } = await fetch(
    "/api/leaderboard/prestige"
  ).then((r) => r.json());

  if (!Array.isArray(data)) return null;

  return data as { value: string; username: string; position: string }[];
}
