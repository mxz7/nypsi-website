<script lang="ts">
  import { sort } from "fast-sort";

  interface Props {
    chatFilter: string[];
  }

  let { chatFilter }: Props = $props();
</script>

{#if chatFilter.length > 0}
  <table class="table w-fit text-xs">
    <!-- head -->
    <thead>
      <tr>
        <th>content</th>
      </tr>
    </thead>
    <tbody>
      {#each sort(chatFilter).asc((i) => i) as filterItem}
        <tr class="hover">
          <td>{filterItem}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p class="text-error">the chat filter is empty</p>
{/if}
