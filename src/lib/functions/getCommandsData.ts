export async function getCommandsData() {
  const res = await fetch("/api/commands").then((res) => res.json());

  if (!res.total || !res.users) return null;

  localStorage.setItem("top-commands", JSON.stringify(res.users));

  return res as { total: number; users: [string, number] };
}
