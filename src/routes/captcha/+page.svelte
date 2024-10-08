<script lang="ts">
  import { enhance } from "$app/forms";
  import { PUBLIC_HCAPTCHA_SITEKEY } from "$env/static/public";
  import { Check } from "lucide-svelte";
  import HCaptcha from "svelte-hcaptcha";

  export let data;

  let token: string;
  let formElement: HTMLFormElement;
  let captcha;
</script>

<svelte:head>
  <title>captcha / nypsi</title>
</svelte:head>

<div class="mt-16 flex w-full justify-center md:mt-32">
  <div class="flex w-full flex-col gap-4 px-4 md:max-w-lg md:px-0">
    {#if data.solved}
      <h1 class="flex justify-center gap-2 text-xl font-bold text-success">
        verified <Check strokeWidth={3} />
      </h1>

      {#if data.rickroll}
        <iframe
          class="h-[200px] w-full rounded-xl md:h-[432px]"
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
          title="YouTube video player"
        />
      {/if}
    {:else}
      <h1 class="text-center text-xl font-bold text-error">
        complete the captcha to continue using commands
      </h1>
      <form use:enhance method="post" bind:this={formElement}>
        <input type="hidden" name="token" bind:value={token} />
      </form>

      <div class="flex w-full justify-center">
        <HCaptcha
          bind:this={captcha}
          sitekey={PUBLIC_HCAPTCHA_SITEKEY}
          on:error={() => captcha.reset()}
          on:success={(payload) => {
            token = payload.detail.token;
            setTimeout(() => {
              formElement.submit();
            }, 500);
          }}
        />
      </div>

      <div>
        <h2 class="font-semibold text-slate-500">why do i have to do this?</h2>
        <p>
          on nypsi, automating commands (by use of macros or scripts) is not allowed as it provides
          an unfair advantage. some players still attempt to bypass this rule, thus we implemented a
          system to detect possible cheaters and force them to do captchas.
        </p>
        <br />
        <p>
          failing too many times or ignoring captchas <strong>will</strong> result in a ban from using
          nypsi.
        </p>
      </div>
    {/if}
  </div>
</div>
