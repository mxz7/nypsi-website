<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div
  class="grow rounded-lg border border-primary border-opacity-5 bg-base-200 p-4 text-center duration-300 hover:border-opacity-20"
>
  {@render children?.()}
</div>
