import { json } from '@sveltejs/kit';
import { inPlaceSort } from 'fast-sort';

export const GET = async ({ getClientAddress, setHeaders }) => {
  setHeaders({
    'cache-control': 'max-age=300',
  });

  const res = await fetch(`${process.env.API || 'http://localhost:6969'}/commands-today`, {
    headers: {
      'X-Forwarded-For': getClientAddress(),
    },
  })
    .then((r) => r.json())
    .catch(() => null);

  if (!res) return new Response('https://http.cat/500', { status: 500 });

  inPlaceSort(res.users as { user: string; amount: number }[]).desc((i) => i.amount);

  let count = 0;
  res.users = res.users.slice(0, 5).map((i: { user: string; amount: number }) => {
    count++;
    return {
      user: { username: i.user.length > 12 ? `${i.user.slice(0, 10).trim()}..` : i.user },
      value: i.amount.toLocaleString(),
      position: count,
    };
  });

  return json(res);
};
