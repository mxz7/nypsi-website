<script>
  import { page } from "$app/stores";
</script>

<img
  class="absolute left-1/2 top-1/3 w-9/12 -translate-x-1/2 -translate-y-1/2 transform sm:top-1/2 sm:w-1/3"
  src="https://http.cat/{$page.status}"
  alt=""
/>

<p class="mt-14 text-center">error: {$page.status}<br />{$page.error.message}</p>
