export async function getCommandsData() {
  const res = await fetch("/api/commands").then((res) => res.json());

  if (!res.total || !res.users) return null;
  return res as { total: number; users: [string, number] };
}
