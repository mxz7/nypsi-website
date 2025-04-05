<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<section
  class="border-primary/5 bg-base-200 hover:border-primary/20 grow rounded-lg border p-4 text-center duration-300"
>
  {@render children?.()}
</section>
