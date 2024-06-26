export const config = {
  runtime: "edge",
};

export const load = async ({ fetch, setHeaders }) => {
  setHeaders({ "cache-control": "s-maxage=3600, stale-while-revalidate, max-age=300" });
  const data = fetch("/api/server-count").then(async (r) => r.json());
  return { topgg: data as Promise<{ server_count: number }> };
};
