export const prerender = true;

export function load() {
  const paths = import.meta.glob("./**/*.md");

  console.log(paths);

  return {
    paths,
  };
}
