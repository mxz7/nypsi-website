<script lang="ts">
  export let item: { name: string; emoji: string; id: string; aliases: string[] };
  export let url = `/leaderboard/${item.id}`;
</script>

<a
  href={url}
  class="p-3 bg-gray-950 bg-opacity-20 w-12 h-12 sm:w-16 sm:h-16 flex justify-center items-center m-1 sm:m-1.5 rounded-md duration-200 ease-in hover:scale-105 border border-transparent hover:border-gray-500"
>
  <img class="max-w-full max-h-full object-contain w-auto h-auto" src={item.emoji} alt="" />
</a>
