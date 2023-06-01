<script lang="ts">
  export let number: string;
</script>

<a
  href="/seasons/{number}"
  class="p-4 bg-gray-950 text-lg bg-opacity-20 flex justify-center items-center m-1 sm:m-1.5 rounded-md duration-200 ease-in hover:scale-105 border border-transparent hover:border-gray-500"
>
  <p class="text-white text-center sm:text-xl">{number}</p>
  <!-- <img class="max-w-full max-h-full object-contain w-auto h-auto" src={item.emoji} alt="" /> -->
</a>
