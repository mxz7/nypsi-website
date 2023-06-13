// See https://kit.svelte.dev/docs/types#app

import type { UserSession } from "$lib/types/User";
import type { Cookies } from "@sveltejs/kit";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      getUser(
        cookies: Cookies,
        fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
      ): Promise<UserSession>;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
