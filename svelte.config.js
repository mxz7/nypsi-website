import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],

  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex({ extensions: [".md"] })],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    prerender: {
      handleHttpError: "warn",
    },
    alias: {
      "@generated/prisma": "./src/generated/prisma/client",
    },

    experimental: {
      remoteFunctions: true,
    },
  },

  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};

export default config;
