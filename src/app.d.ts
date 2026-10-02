// See https://kit.svelte.dev/docs/types#app

import type { Session, User } from "#lib/types/Auth.js";
import type { Logger } from "pino";

// for information about these interfaces
declare global {
  interface Window {
    umami?: {
      identify(uniqueId: string, data: Record<string, string>): void;
    };
  }

  namespace App {
    interface Error {
      requestId?: string;
      errorId?: string;
      reconnectUrl?: string;
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
      errorId?: string;
      authedUser?: User | null;
      logger: Logger;
      message: unknown;
      auth?: {
        user: User;
        session: Session;
      } | null;
    }
  }
}

export {};
