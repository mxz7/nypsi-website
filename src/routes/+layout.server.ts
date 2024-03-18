export const load = async ({ locals }) => {
  const auth = locals.validate();

  return {
    user: (await auth)?.user,
  };
};
