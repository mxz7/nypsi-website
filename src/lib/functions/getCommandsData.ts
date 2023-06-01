import { inPlaceSort } from "fast-sort";

export async function getCommandsData(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
  const res = await fetch("/api/commands").then((res) => res.json());

  if (!res.total || !res.users) return null;

  inPlaceSort(res.users as { user: string; amount: number }[]).desc((i) => i.amount);

  let count = 0;
  res.users = res.users.slice(0, 10).map((i: { user: string; amount: number }) => {
    count++;
    return {
      username: i.user.length > 12 ? `${i.user.slice(0, 10).trim()}..` : i.user,
      value: i.amount.toLocaleString(),
      position: count
    };
  });

  return res as { total: number; users: { username: string; value: string; position: number }[] };
}

export async function getTopCommands(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
  const data = await getCommandsData(fetch);

  if (!data?.users || !Array.isArray(data.users)) return null;

  return data.users;
}
