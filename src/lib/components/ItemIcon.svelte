<script lang="ts">
  import { page } from "$app/stores";
  import tooltip from "$lib/Tooltips";

  export let item: { name: string; emoji: string; id: string; aliases: string[] };
  export let url: string = "";
  export let onClick = (itemId?: string) => {};
  export let selected = false;
  export let includeSearchParams = false;
</script>

<a
  href={url
    ? `${url}/${item.id}${
        $page.url.searchParams.size > 0 && includeSearchParams
          ? `?${$page.url.searchParams.toString()}`
          : ""
      }`
    : null}
  on:click={() => {
    onClick(item.id);
  }}
  class="flex h-16 w-16 items-center justify-center rounded-md border border-primary border-opacity-5 bg-base-200 duration-200 ease-in hover:scale-105 hover:border-opacity-50 sm:m-1.5 sm:h-20 sm:w-20 {selected
    ? 'border-primary border-opacity-50'
    : ''} cursor-pointer"
>
  <!-- <p>{item.id}</p> -->
  <div
    class="flex h-full w-full items-center justify-center p-3 sm:h-20 sm:w-20"
    use:tooltip={{ content: item.name, theme: "tooltip" }}
  >
    <img
      class="h-auto max-h-full w-auto max-w-full object-contain"
      src={item.emoji}
      alt=""
      loading="lazy"
    />
  </div>
</a>
