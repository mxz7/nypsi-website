export const load = async ({ locals, cookies, fetch }) => {
  const user = await locals.getUser(cookies, fetch);

  return { user };
};
