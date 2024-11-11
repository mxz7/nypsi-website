// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface PageData {}
    // interface Platform {}
    interface PageState {
      docsItemModal?: Record<string, Record<string, any>>;
    }
    interface Locals {
      validate: () => Promise<{
        user: import("lucia").User;
        session: import("lucia").Session;
      } | null>;
    }
  }
}

export {};
