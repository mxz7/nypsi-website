<script lang="ts">
  export let item: { name: string; emoji: string; id: string; aliases: string[] };
</script>

<a
  href="/leaderboard/{item.id}"
  class="m-1 flex h-12 w-12 items-center justify-center rounded-md border border-transparent bg-gray-950 bg-opacity-20 p-3 duration-200 ease-in hover:scale-105 hover:border-gray-500 sm:m-1.5 sm:h-16 sm:w-16"
>
  <!-- <p>{item.id}</p> -->
  <img class="h-auto max-h-full w-auto max-w-full object-contain" src={item.emoji} alt="" />
</a>
