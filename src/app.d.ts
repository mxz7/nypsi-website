// See https://kit.svelte.dev/docs/types#app

import type { Session, User } from "$lib/types/Auth";

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
        user: User;
        session: Session;
      } | null>;
      startTimer: number;
      error: string;
      errorId: string;
      errorStackTrace: string;
      message: unknown;
      auth?: {
        user: User;
        session: Session;
      };
    }
  }
}

export { };

