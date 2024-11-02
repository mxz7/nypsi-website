<script lang="ts">
  interface Props {
    title: string;
    desc?: string;
  }

  let { title, desc }: Props = $props();
</script>

<svelte:head>
  <title>{title} / nypsi docs</title>
  {#if desc}
    <meta name="description" content={desc} />
  {/if}
</svelte:head>

<h1>{title}</h1>
<p>{desc}</p>
