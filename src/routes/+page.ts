export const config = {
  runtime: "edge",
};

export const load = async ({ fetch, setHeaders }) => {
  setHeaders({ "cache-control": "s-maxage=300, stale-while-revalidate" });
  const data = fetch("/api/server-count").then(async (r) => r.json());
  return { topgg: data as Promise<{ server_count: number }> };
};
