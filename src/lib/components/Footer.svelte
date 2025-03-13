<script>
  import { BadgeDollarSign, Code, FileText, Hammer, Lock } from "lucide-svelte";
</script>

<footer class="bg-base-200 mt-24 flex w-full justify-center py-5">
  <div class="flex flex-wrap justify-evenly gap-x-10 gap-y-6 px-12 lg:max-w-5xl lg:px-0">
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
  @reference "../../app.css";

  a {
    @apply fill-base-content flex items-center gap-1 duration-300 hover:fill-white hover:text-white;
  }

  a > span {
    @apply text-xs;
  }
</style>
