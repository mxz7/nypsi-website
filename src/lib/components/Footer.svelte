<script>
  import { BadgeDollarSign, Code, FileText, Hammer, Lock } from "lucide-svelte";
</script>

<footer class="mt-24 flex w-full justify-center bg-base-200 py-5">
  <div class="flex flex-wrap justify-evenly gap-8 px-4 lg:max-w-5xl lg:px-0">
    <a href="/terms">
      <FileText size={16} strokeWidth={2} />
      <span>terms</span>
    </a>

    <a href="/privacy">
      <Lock size={16} strokeWidth={2} />
      <span>privacy</span>
    </a>

    <a href="/rules">
      <Hammer size={16} strokeWidth={2} />
      <span>rules</span>
    </a>

    <a href="https://github.com/mxz7/nypsi-website" target="_blank">
      <Code size={16} strokeWidth={2} />
      <span>github</span>
    </a>

    <a href="/supporters">
      <BadgeDollarSign size={16} strokeWidth={2} />
      <span>supporters</span>
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
