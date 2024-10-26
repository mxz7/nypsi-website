<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div
  class="mt-4 rounded-lg border border-primary border-opacity-5 bg-base-200 py-5 duration-300 hover:border-opacity-20"
>
  <h1 class="text-center text-error lg:text-lg">
    {@render children?.()}
  </h1>
</div>
