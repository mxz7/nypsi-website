<script lang="ts">
  let {
    text,
    anchor,
    header,
  }: { text: string; anchor: string; header: "h1" | "h2" | "h3" | "h4" } = $props();
</script>

{#snippet content()}
  <a href="#{anchor}">{text}</a>
{/snippet}

{#if header === "h1"}
  <h1>{@render content()}</h1>
{:else if header === "h2"}
  <h2>{@render content()}</h2>
{:else if header === "h3"}
  <h3>{@render content()}</h3>
{:else if header === "h4"}
  <h4>{@render content()}</h4>
{/if}
