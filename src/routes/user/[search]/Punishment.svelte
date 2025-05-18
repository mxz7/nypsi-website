<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<section
  class="border-primary/5 bg-base-200 hover:border-primary/20 mt-4 rounded-lg border py-5 duration-300"
>
  <h2 class="text-error text-center lg:text-lg">
    {@render children?.()}
  </h2>
</section>
