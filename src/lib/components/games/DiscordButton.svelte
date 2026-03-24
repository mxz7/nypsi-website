<script lang="ts">
  import { parse } from "@twemoji/parser";

  interface Props {
    data: {
      style: 1 | 2 | 3 | 4;
      emoji?: { name: string; id?: string; animated?: boolean };
    };
  }

  let { data }: Props = $props();

  const background = $derived.by(() => {
    if (data.style === 3) {
      return "#166534";
    } else if (data.style === 4) {
      return "#c62828";
    } else {
      return "#1f2937";
    }
  });

  const emojiUrl = $derived.by(() => {
    if (data.emoji && parse(data.emoji.name, { assetType: "png" })[0]?.url) {
      return parse(data.emoji.name, { assetType: "png" })[0].url;
    } else if (data.emoji && data.emoji.id) {
      let url = `https://cdn.discordapp.com/emojis/${data.emoji.id}`;

      if (data.emoji.animated) {
        url = url + ".gif";
      } else {
        url = url + ".png";
      }

      return url;
    } else {
      return null;
    }
  });
</script>

<div
  style="background-color: {background};"
  class="flex h-8 w-16 items-center justify-center overflow-hidden rounded-lg p-1.25 sm:h-12 sm:w-24"
>
  {#if emojiUrl}
    <img src={emojiUrl} class="h-4 opacity-50 sm:h-8" alt="scratch card item" />
  {/if}
</div>
