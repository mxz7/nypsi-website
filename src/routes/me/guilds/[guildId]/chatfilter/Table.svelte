<script lang="ts">
  import { sort } from "fast-sort";

  interface Props {
    chatFilter: { content: string; percentMatch: number }[];
  }

  let { chatFilter }: Props = $props();
</script>

{#if chatFilter.length > 0}
  <table class="table mt-4 w-full flex-1 text-xs">
    <!-- head -->
    <thead>
      <tr>
        <th>content</th>
        <th>percent</th>
      </tr>
    </thead>
    <tbody>
      {#each sort(chatFilter).asc((i) => i) as filterItem}
        <tr class="hover">
          <td>{filterItem.content}</td>
          <td>{filterItem.percentMatch}%</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p class="text-error">the chat filter is empty</p>
{/if}
