<script lang="ts">
  export let text: string;
  export let key: string;
</script>

<a
  href="/leaderboard/{key}"
  class="m-1 flex items-center justify-center rounded-md border border-transparent bg-gray-950 bg-opacity-20 p-3 duration-200 ease-in hover:scale-105 hover:border-gray-500 sm:m-1.5"
>
  <p class="text-center text-white sm:text-xl">{text}</p>
  <!-- <img class="max-w-full max-h-full object-contain w-auto h-auto" src={item.emoji} alt="" /> -->
</a>
