interface Base {
  authenticated: boolean;
}

interface NotAuthenticated extends Base {
  authenticated: false;
}

export interface User extends Base {
  authenticated: true;
  username: string;
  discriminator: string;
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

interface UserApiResponsexd extends BaseUserApiResponse {
  message: "success";
  lastCommand: number;
  badges: string[];
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
