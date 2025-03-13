<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div
  class="border-primary/5 bg-base-200 hover:border-primary/20 mt-4 rounded-lg border py-5 duration-300"
>
  <h1 class="text-error text-center lg:text-lg">
    {@render children?.()}
  </h1>
</div>
