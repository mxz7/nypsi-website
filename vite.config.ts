import { imagetools } from "@zerodevx/svelte-img/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), imagetools()],
});
