<script lang="ts">
  let { guild: guild, pos }: { guild: { id: string; }; pos: number } = $props();
</script>

<p
  class="{pos === 1
    ? 'text-primary font-semibold'
    : 'text-slate-300'} min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
>
  {guild.id}
</p>
