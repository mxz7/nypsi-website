<script lang="ts">
  export let data;
</script>

<div class="text-white">
  {#await data.streamed.userData}
    <p>loading boobies</p>
  {:then boobies}
    <p>{JSON.stringify(boobies)}</p>
  {/await}
</div>
