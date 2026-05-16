// See https://kit.svelte.dev/docs/types#app

import type { Session, User } from "$lib/types/Auth";
import type { Logger } from "pino";

// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      requestId?: string;
    }
    // interface PageData {}
    // interface Platform {}
    interface PageState {
      docsItemModal?: Record<string, Record<string, any>>;
    }
    interface Locals {
      startTimer: number;
      error: string;
      errorStackTrace: string;
      logger: Logger;
      message: unknown;
      auth?: {
        user: User;
        session: Session;
      };
    }
  }
}

export {};
