<script lang="ts">
  interface Props {
    outcome: string;
  }

  let { outcome }: Props = $props();
</script>

<div class="flex w-full items-center justify-center">
  <img
    src="https://cdn.discordapp.com/emojis/{outcome
      ?.split('**|**')[0]
      .split(':')[2]
      .replace('>', '')}"
    alt=""
    class="h-14 w-14"
  />
  <p class="mx-3 text-5xl text-slate-200">-</p>
  <img
    src="https://cdn.discordapp.com/emojis/{outcome
      ?.split('**|**')[1]
      .split(':')[2]
      .replace('>', '')}"
    alt=""
    class="h-14 w-14"
  />
  <p class="mx-3 text-5xl text-slate-200">-</p>
  <img
    src="https://cdn.discordapp.com/emojis/{outcome
      ?.split('**|**')[2]
      .split(':')[2]
      .replace('>', '')}"
    alt=""
    class="h-14 w-14"
  />
</div>
