<script lang="ts">
  import { PUBLIC_HCAPTCHA_SITEKEY } from "$env/static/public";
  import HCaptcha from "svelte-hcaptcha";

  let token: string;
  let form: HTMLFormElement;
  let captcha;
</script>

<div class="flex w-full justify-center">
  <form class="mt-32" action="?/captcha" method="post" bind:this={form}>
    <input type="hidden" name="token" bind:value={token} />
  </form>

  <HCaptcha
    bind:this={captcha}
    sitekey={PUBLIC_HCAPTCHA_SITEKEY}
    on:error={() => captcha.reset()}
    on:success={(payload) => {
      token = payload.detail.token;
      setTimeout(() => {
        form.submit();
      }, 500);
    }}
  />
</div>
