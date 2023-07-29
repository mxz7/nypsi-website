export async function getCommandsData(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
) {
  const res = await fetch("/api/commands").then((res) => res.json());

  if (!res.total || !res.users) return null;

  return res as { total: number; users: { username: string; value: string; position: number }[] };
}

export async function getTopCommands(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
) {
  const data = await getCommandsData(fetch);

  if (!data?.users || !Array.isArray(data.users)) return null;

  return data.users;
}
