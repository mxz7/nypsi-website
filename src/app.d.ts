// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
    interface PageState {
      leaderboardSelection?: number;
      leaderboardItem?: string;
      leaderboardPath?: string;
      leaderboardName?: string;
    }
  }
}

export {};
