export const load = async ({ locals, request }) => {
  const auth = locals.validate();

  if (request.headers.get("user-agent")?.toLowerCase().includes("bot")) {
    return { user: (await auth).user };
  }
  return {
    user: auth.then((auth) => auth?.user),
  };
};
