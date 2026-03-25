<script lang="ts">
  import { page } from "$app/state";

  let {
    text,
    anchor,
    header,
  }: { text: string; anchor?: string; header: "h1" | "h2" | "h3" | "h4" | "h5" } = $props();

  const id = $derived(anchor || text.replaceAll(" ", "-").replaceAll("'", "").replaceAll("?", ""));
</script>

{#snippet content()}
  <a href="#{id}" class={page.url.hash === `#${anchor}` ? "link" : "link-hover"}>{text}</a>
{/snippet}

{#if header === "h1"}
  <h1 {id}>{@render content()}</h1>
{:else if header === "h2"}
  <h2 {id}>{@render content()}</h2>
{:else if header === "h3"}
  <h3 {id}>{@render content()}</h3>
{:else if header === "h4"}
  <h4 {id}>{@render content()}</h4>
{:else if header === "h5"}
  <h5 {id}>{@render content()}</h5>
{/if}
