<script>
  import { page } from "$app/state";
  import Main from "$lib/components/ui/Main.svelte";

  const status = $derived(page.status ?? 500);
  const standardMessageByStatus = {
    400: "bad request",
    401: "unauthorized",
    403: "forbidden",
    404: "not found",
    405: "method not allowed",
    408: "request timeout",
    409: "conflict",
    410: "gone",
    413: "payload too large",
    415: "unsupported media type",
    418: "i'm a teapot",
    422: "unprocessable content",
    429: "too many requests",
    500: "internal server error",
    501: "not implemented",
    502: "bad gateway",
    503: "service unavailable",
    504: "gateway timeout",
  };

  const copy = $derived.by(() => {
    switch (status) {
      case 404:
        return {
          title: "page not found",
          description: "that page does not exist, or it may have moved.",
        };
      case 401:
        return {
          title: "sign in required",
          description: "you need to sign in before you can view this page.",
        };
      case 403:
        return {
          title: "access denied",
          description: "you do not have permission to view this page.",
        };
      default:
        if (status >= 500) {
          return {
            title: "server error",
            description: "our side had a problem loading this page. please try again shortly.",
          };
        }

        return {
          title: "something went wrong",
          description: "we could not load this page right now. please try again.",
        };
    }
  });

  const description = $derived.by(() => {
    const message = page.error?.message?.trim();
    if (!message) return copy.description;

    const standardMessage = standardMessageByStatus[status];
    if (!standardMessage) return message;

    return message.toLowerCase() === standardMessage ? copy.description : message;
  });
</script>

<svelte:head>
  <title>{status} - {copy.title} | nypsi</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Main class="text-center">
  <p class="text-primary text-8xl font-extrabold sm:text-9xl">{status}</p>
  <h1 class="mt-2 text-4xl font-bold text-white sm:text-5xl">{copy.title}</h1>
  <p class="mx-auto mt-3 max-w-xl text-slate-300">{description}</p>

  <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
    <a href="/" class="btn btn-soft btn-primary btn-wide">go home</a>
  </div>

  {#if page.error?.message && page.error.message !== description}
    <p class="mt-6 text-sm text-slate-400">{page.error.message}</p>
  {/if}
  {#if page.error?.errorId}
    <p class="font-mono text-xs text-slate-500">ref: {page.error.errorId}</p>
  {/if}
</Main>
