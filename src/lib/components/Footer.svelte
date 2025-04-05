<script>
  import { BadgeDollarSign, Code, FileText, Hammer, Lock } from "@lucide/svelte";
</script>

<footer class="bg-base-200 mt-24 flex w-full justify-center py-5">
  <menu class="flex flex-wrap justify-evenly gap-x-10 gap-y-6 px-12 lg:max-w-5xl lg:px-0">
    <li>
      <a href="/terms">
        <FileText size={16} strokeWidth={2} />
        <span>terms</span>
      </a>
    </li>

    <li>
      <a href="/privacy">
        <Lock size={16} strokeWidth={2} />
        <span>privacy</span>
      </a>
    </li>

    <li>
      <a href="/rules">
        <Hammer size={16} strokeWidth={2} />
        <span>rules</span>
      </a>
    </li>

    <li>
      <a href="https://github.com/mxz7/nypsi-website" target="_blank">
        <Code size={16} strokeWidth={2} />
        <span>github</span>
      </a>
    </li>

    <li>
      <a href="/supporters">
        <BadgeDollarSign size={16} strokeWidth={2} />
        <span>supporters</span>
      </a>
    </li>
  </menu>
</footer>

<style>
  @reference "../../app.css";

  a {
    @apply fill-base-content link-hover flex items-center gap-1 text-xs duration-300;
  }
</style>
