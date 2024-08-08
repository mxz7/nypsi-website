export const prerender = true;

export function load({ setHeaders }) {
  setHeaders({ "cache-control": "public, max-age=86400" });
}
