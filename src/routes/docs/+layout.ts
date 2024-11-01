export const prerender = true;

const paths = import.meta.glob("./**/*.md");

export function load() {
  return {
    paths,
  };
}
