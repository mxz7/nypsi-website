<script lang="ts">
  interface Props {
    number: string;
  }

  let { number }: Props = $props();
</script>

<a
  href="/seasons/{number}"
  class="bg-base-200 m-1 flex items-center justify-center rounded-md border border-transparent p-4 text-lg duration-200 ease-in hover:scale-105 hover:border-slate-500 sm:m-1.5"
>
  <p class="text-center text-white sm:text-xl">{number}</p>
  <!-- <img class="max-w-full max-h-full object-contain w-auto h-auto" src={item.emoji} alt="" /> -->
</a>
