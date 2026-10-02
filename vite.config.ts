import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: [".svelte", ".md"],
      // Consult https://kit.svelte.dev/docs/integrations#preprocessors
      // for more information about preprocessors
      preprocess: [vitePreprocess(), mdsvex({ extensions: [".md"] })],
      compilerOptions: { experimental: { async: true } },
      // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
      // If your environment is not supported or you settled on a specific environment, switch out the adapter.
      // See https://kit.svelte.dev/docs/adapters for more information about adapters.
      adapter: adapter(),
      prerender: { handleHttpError: "warn" },
      alias: { "@generated/prisma": "./src/generated/prisma/client" },
      experimental: { remoteFunctions: true },
    }),
    tailwindcss(),
  ],
  test: { include: ["tests/**/*.test.ts"] },
});
