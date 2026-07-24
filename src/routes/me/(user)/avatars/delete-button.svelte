<script lang="ts">
  import { Trash } from "@lucide/svelte";

  interface Props {
    avatar: {
      id: number;
    };
  }

  let { avatar }: Props = $props();
</script>

<form action="?/delete" method="post">
  <input type="hidden" name="id" value={avatar.id} />
  <button type="submit" class="btn btn-xs">
    <Trash class="text-error" size={16} />
  </button>
</form>
