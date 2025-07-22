// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      errorId?: string;
    }
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
      startTimer: number;
      error: string;
      errorId: string;
      errorStackTrace: string;
      message: unknown;
      auth?: {
        user: import("lucia").User;
        session: import("lucia").Session;
      };
    }
  }
}

export {};
