interface BaseGuild {
  success: boolean;
}

interface GuildError extends BaseGuild {
  success: false;
}

export interface GuildSuccess extends BaseGuild {
  success: true;
  guild: {
    guildName: string;
    createdAt: number;
    balance: number;
    xp: number;
    tokens: number;
    level: number;
    motd: string;
    owner: {
      user: {
        avatar: string;
        lastKnownUsername: string;
      };
    };
    members: {
      economy: {
        user: {
          avatar: string;
          lastKnownUsername: string;
        };
      };
      joinedAt: number;
      contributedMoney: number;
      contributedXp: number;
    }[];
  };
}

export type ApiGuildResponse = GuildSuccess | GuildError;
