export const config = {
  isr: {
    expiration: 300,
  },
};

export const load = async ({ fetch, setHeaders }) => {
  // setHeaders({ "cache-control": "s-maxage=600" });
  const data = fetch("/api/server-count").then(async (r) => r.json());
  return { topgg: data as Promise<{ server_count: number }> };
};
