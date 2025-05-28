<script lang="ts">
  import DocsHeader from "./DocsHeader.svelte";

  interface Props {
    title: string;
    description?: string;
  }

  let { title, description }: Props = $props();
</script>

<svelte:head>
  <title>{title} | nypsi docs</title>
  <meta name="og:title" content="{title} | nypsi docs" />
  <meta name="description" content={description} />
</svelte:head>

<DocsHeader anchor={title.replaceAll(" ", "-")} header="h1" text={title} />
