<script lang="ts">
  import { page } from "$app/stores";

  let {
    text,
    anchor,
    header,
  }: { text: string; anchor?: string; header: "h1" | "h2" | "h3" | "h4" } = $props();

  if (!anchor) anchor = text.replaceAll(" ", "-").replaceAll("'", "").replaceAll("?", "");
</script>

{#snippet content()}
  <a href="#{anchor}" class={$page.url.hash === `#${anchor}` ? "link" : "link-hover"}>{text}</a>
{/snippet}

{#if header === "h1"}
  <h1 id={anchor}>{@render content()}</h1>
{:else if header === "h2"}
  <h2 id={anchor}>{@render content()}</h2>
{:else if header === "h3"}
  <h3 id={anchor}>{@render content()}</h3>
{:else if header === "h4"}
  <h4 id={anchor}>{@render content()}</h4>
{/if}
