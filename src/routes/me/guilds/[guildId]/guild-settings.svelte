<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Card from "$lib/components/ui/card.svelte";
  import {
    Hash,
    MessageSquareText,
    Plus,
    Save,
    ShieldCheck,
    SlidersHorizontal,
    X,
  } from "@lucide/svelte";
  import { untrack } from "svelte";
  import { toast } from "svelte-sonner";
  import { saveGuildSettings, saveModlogs } from "./settings.remote";

  type DashboardData = {
    channels: {
      id: string;
      name: string;
      parentId: string | null;
      parentName: string | null;
      position: number;
    }[];
    settings: {
      altPunish: boolean;
      disabledChannels: string[];
      modlogsChannelId: string | null;
      modlogsEnabled: boolean;
      prefixes: string[];
      slashOnly: boolean;
    };
  };

  interface Props {
    dashboard: DashboardData;
    guildId: string;
  }

  let { dashboard, guildId }: Props = $props();

  const initialDashboard = untrack(() => dashboard);
  const availableChannelIds = new Set(initialDashboard.channels.map((channel) => channel.id));

  let altPunish = $state(initialDashboard.settings.altPunish);
  let disabledChannels = $state(
    initialDashboard.settings.disabledChannels.filter((channelId) =>
      availableChannelIds.has(channelId),
    ),
  );
  let modlogsChannelId = $state(initialDashboard.settings.modlogsChannelId ?? "");
  let modlogsEnabled = $state(initialDashboard.settings.modlogsEnabled);
  let prefixes = $state([...initialDashboard.settings.prefixes]);
  let slashOnly = $state(initialDashboard.settings.slashOnly);

  function addPrefix() {
    if (prefixes.length < 5) prefixes.push("");
  }

  function removePrefix(index: number) {
    if (prefixes.length > 1) prefixes.splice(index, 1);
  }
</script>

<form
  id="server-settings-form"
  {...saveGuildSettings.enhance(async (form) => {
    const success = await form.submit();

    if (success) {
      toast.success("server settings updated");
      await invalidateAll();
    } else {
      toast.error(
        saveGuildSettings.fields.allIssues()?.[0]?.message ?? "unable to update settings",
      );
    }
  })}
  class="hidden"
>
  <input {...saveGuildSettings.fields.guildId.as("hidden", guildId)} />
  <input {...saveGuildSettings.fields.altPunish.as("hidden", altPunish ? "true" : "false")} />
  <input
    {...saveGuildSettings.fields.disabledChannels.as("hidden", JSON.stringify(disabledChannels))}
  />
  <input {...saveGuildSettings.fields.prefixes.as("hidden", JSON.stringify(prefixes))} />
  <input {...saveGuildSettings.fields.slashOnly.as("hidden", slashOnly ? "true" : "false")} />
</form>

<div class="mt-4 grid gap-4 xl:grid-cols-2">
  <Card mode="section" class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <span class="rounded-box bg-base-300 text-primary p-2">
        <ShieldCheck size={20} />
      </span>
      <div>
        <h3 class="font-bold">command behaviour</h3>
        <p class="text-base-content/65 text-sm">control how members can use nypsi</p>
      </div>
    </div>

    <label class="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span class="block font-medium">slash commands only</span>
        <span class="text-base-content/65 block text-sm">
          disable all prefix-based commands in this server
        </span>
      </span>
      <input type="checkbox" class="toggle toggle-primary shrink-0" bind:checked={slashOnly} />
    </label>

    <div class="divider my-0"></div>

    <div>
      <h4 class="font-medium">prefixes</h4>
      <p class="text-base-content/65 text-sm">configure up to five command prefixes</p>
    </div>

    <div class="space-y-2">
      {#each prefixes as prefix, index (index)}
        <div class="flex gap-2">
          <input
            class="input input-bordered w-full"
            aria-label="prefix {index + 1}"
            maxlength="3"
            bind:value={prefixes[index]}
          />
          <button
            type="button"
            class="btn btn-square btn-ghost"
            aria-label="remove prefix {prefix}"
            disabled={prefixes.length === 1}
            onclick={() => removePrefix(index)}
          >
            <X size={18} />
          </button>
        </div>
      {/each}
    </div>

    {#each saveGuildSettings.fields.prefixes.issues() as issue (issue.message)}
      <p class="text-error text-sm">{issue.message}</p>
    {/each}

    <button type="button" class="btn btn-soft" disabled={prefixes.length >= 5} onclick={addPrefix}>
      <Plus size={18} />
      add prefix
    </button>
  </Card>

  <Card mode="section" class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <span class="rounded-box bg-base-300 text-primary p-2">
        <MessageSquareText size={20} />
      </span>
      <div>
        <h3 class="font-bold">moderation</h3>
        <p class="text-base-content/65 text-sm">configure moderation behaviour and logging</p>
      </div>
    </div>

    <label class="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span class="block font-medium">automatic alt punishments</span>
        <span class="text-base-content/65 block text-sm">
          punish linked alt accounts alongside the original account
        </span>
      </span>
      <input type="checkbox" class="toggle toggle-primary shrink-0" bind:checked={altPunish} />
    </label>

    <div class="divider my-0"></div>

    <form
      {...saveModlogs.enhance(async (form) => {
        const success = await form.submit();

        if (success) {
          modlogsEnabled = Boolean(modlogsChannelId);
          toast.success(modlogsEnabled ? "modlogs channel updated" : "modlogs disabled");
          await invalidateAll();
        } else {
          toast.error(saveModlogs.fields.allIssues()?.[0]?.message ?? "unable to update modlogs");
        }
      })}
      class="flex flex-col gap-4"
    >
      <input {...saveModlogs.fields.guildId.as("hidden", guildId)} />
      <input {...saveModlogs.fields.channelId.as("hidden", modlogsChannelId)} />

      <div>
        <h4 class="font-medium">modlogs</h4>
        <p class="text-base-content/65 text-sm">
          send bans, kicks, warnings, and other moderation actions to a channel
        </p>
      </div>

      {#if modlogsEnabled && !dashboard.settings.modlogsChannelId}
        <div class="alert alert-warning text-sm">
          the existing modlogs webhook could not be matched to a channel; select a channel to
          replace it or choose disabled
        </div>
      {/if}

      <label class="form-control w-full">
        <span class="label-text mb-2">modlogs channel</span>
        <select class="select select-bordered w-full" bind:value={modlogsChannelId}>
          <option value="">disabled</option>
          {#each dashboard.channels as channel (channel.id)}
            <option value={channel.id}>
              {channel.parentName ? `${channel.parentName} / ` : ""}#{channel.name}
            </option>
          {/each}
        </select>
      </label>

      <button
        class="btn btn-primary"
        disabled={saveModlogs.pending > 0}
        aria-busy={saveModlogs.pending > 0}
      >
        {#if saveModlogs.pending}
          <span class="loading loading-spinner"></span>
        {:else}
          <Save size={18} />
        {/if}
        save modlogs
      </button>
    </form>
  </Card>

  <Card mode="section" class="flex min-h-0 flex-col gap-4 xl:col-span-2">
    <div class="flex items-center gap-3">
      <span class="rounded-box bg-base-300 text-primary p-2">
        <SlidersHorizontal size={20} />
      </span>
      <div>
        <h3 class="font-bold">disabled channels</h3>
        <p class="text-base-content/65 text-sm">prevent commands in selected channels</p>
      </div>
    </div>

    <div class="bg-base-300/40 max-h-64 space-y-1 overflow-y-auto rounded-lg p-2">
      {#each dashboard.channels as channel (channel.id)}
        <label
          class="hover:bg-base-300 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2"
        >
          <input
            type="checkbox"
            class="checkbox checkbox-primary checkbox-sm"
            bind:group={disabledChannels}
            value={channel.id}
          />
          <Hash size={15} class="text-base-content/50 shrink-0" />
          <span class="min-w-0 truncate">{channel.name}</span>
          {#if channel.parentName}
            <span class="text-base-content/45 ml-auto truncate text-xs">{channel.parentName}</span>
          {/if}
        </label>
      {:else}
        <p class="text-base-content/60 py-6 text-center text-sm">no text channels available</p>
      {/each}
    </div>
  </Card>

  <div class="xl:col-span-2">
    <button
      form="server-settings-form"
      class="btn btn-primary w-full"
      disabled={saveGuildSettings.pending > 0}
      aria-busy={saveGuildSettings.pending > 0}
    >
      {#if saveGuildSettings.pending}
        <span class="loading loading-spinner"></span>
      {:else}
        <Save size={18} />
      {/if}
      save server settings
    </button>
  </div>
</div>
