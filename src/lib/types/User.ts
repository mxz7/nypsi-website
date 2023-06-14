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
  message: undefined;
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
      date: Date;
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
          joinedAt: Date;
          economy: {
            user: {
              lastKnownTag: string;
              id: string;
            };
          };
        }[];
      };
    };
    Inventory: {
      item: string;
    }[];
    money: number;
    bank: number;
    bankStorage: number;
    banned: Date;
    netWorth: number;
    prestige: number;
    dailyStreak: number;
    xp: number;
  };
  Premium?: {
    level: number;
  };
  lastKnownTag: string;
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
