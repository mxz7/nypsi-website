<script lang="ts">
  import Tooltip from "sv-tooltip";

  export let item: { name: string; emoji: string; id: string; aliases: string[] };
</script>

<a
  href="/leaderboard/{item.id}"
  class="flex h-16 w-16 items-center justify-center rounded-md border border-transparent bg-gray-950 bg-opacity-20 p-3 duration-200 ease-in hover:scale-105 hover:border-gray-500 sm:m-1.5 sm:h-20 sm:w-20"
>
  <Tooltip tip={item.name} top color="#0E1422">
    <!-- <p>{item.id}</p> -->
    <img
      class="h-auto max-h-full w-auto max-w-full object-contain"
      src={item.emoji}
      alt=""
      loading="lazy"
    />
  </Tooltip>
</a>
