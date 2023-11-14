interface NotAuthenticated {
  authenticated: false;
}

interface User {
  authenticated: true;
  username: string;
  avatar: string;
  id: string;
}

export type UserSession = NotAuthenticated | User;

interface BaseUserApiResponse {
  message?: string;
}

interface ErrorUserApiResponse extends BaseUserApiResponse {
  message: "boobs";
}

export interface UserApiResponsexd extends BaseUserApiResponse {
  message: "success";
  id: string;
  lastCommand: number;
  Tags: { tagId: string; selected: boolean }[];
  Leaderboards: { position: number; leaderboard: string }[];
  Achievements: { achievementId: string }[];
  blacklisted: boolean;
  CommandUse: {
    command: string;
    uses: number;
  }[];
  Economy: {
    BakeryUpgrade: {
      amount: number;
      upgradeId: string;
    }[];
    Game: {
      date: number;
      game: string;
      win: number;
      id: number;
      bet: number;
      earned: number;
    }[];
    EconomyGuildMember?: {
      guild: {
        guildName: string;
        level: number;
        xp: number;
        balance: number;
        members: {
          joinedAt: number;
          economy: {
            user: {
              lastKnownUsername: string;
              id: string;
            };
          };
        }[];
      };
    };
    Inventory: {
      item: string;
      amount: number;
    }[];
    money: number;
    bank: number;
    bankStorage: number;
    banned: number;
    netWorth: number;
    prestige: number;
    level: number;
    dailyStreak: number;
    xp: number;
  };
  Premium?: {
    level: number;
  };
  lastKnownUsername: string;
  avatar: string;
  WordleStats?: {
    history: number[];
    lose: number;
    win1: number;
    win2: number;
    win4: number;
    win5: number;
    win3: number;
    win6: number;
  };
}

export type UserApiResponse = UserApiResponsexd | ErrorUserApiResponse;
