<script lang="ts">
  import { parse } from "$lib/functions/twemoji";

  export let data: {
    style: 1 | 2 | 3 | 4;
    emoji?: { name: string; id?: string; animated?: boolean };
  };

  let background = "#1f2937";
  if (data.style === 3) {
    background = "#166534";
  } else if (data.style === 4) {
    background = "#c62828";
  }

  let emojiUrl = "";

  // console.log(data.emoji?.name);

  if (data.emoji && parse(data.emoji.name, { assetType: "png" })) {
    emojiUrl = parse(data.emoji.name, { assetType: "png" });
  } else if (data.emoji && data.emoji.id) {
    emojiUrl = `https://cdn.discordapp.com/emojis/${data.emoji.id}`;

    if (data.emoji.animated) {
      emojiUrl = emojiUrl + ".gif";
    } else {
      emojiUrl = emojiUrl + ".png";
    }
  }
</script>

<div
  style="background-color: {background};"
  class="flex h-8 w-16 items-center justify-center rounded p-[5px] sm:h-12 sm:w-24"
>
  {#if emojiUrl}
    <img
      src={emojiUrl}
      class="h-auto max-h-full w-auto max-w-full object-contain opacity-50"
      alt="scratch card item"
    />
  {/if}
</div>
