<script>
  import Discord from "$lib/assets/svg/discord.svelte";
  import { Code, FileText, Lock } from "lucide-svelte";
</script>

<footer class="mt-24 flex w-full justify-center bg-base-200 py-5">
  <div class="flex gap-8 px-4 lg:max-w-5xl lg:px-0">
    <a href="/terms">
      <FileText size={16} strokeWidth={3} />
      <span>terms</span>
    </a>

    <a href="/privacy">
      <Lock size={16} strokeWidth={3} />
      <span>privacy</span>
    </a>

    <a href="https://github.com/mxz7/nypsi-website" target="_blank">
      <Code size={16} strokeWidth={3} />
      <span>github</span>
    </a>

    <a href="/discord" target="_blank">
      <div class="h-4 w-4">
        <Discord />
      </div>
      <span>discord</span>
    </a>
  </div>
</footer>

<style>
  a {
    @apply flex items-center gap-1 fill-base-content duration-300 hover:fill-white hover:text-white;
  }

  a > span {
    @apply font-mono text-xs;
  }
</style>
