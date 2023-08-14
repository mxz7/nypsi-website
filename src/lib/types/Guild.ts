interface BaseGuild {
  success: boolean;
}

interface GuildError extends BaseGuild {
  success: false;
}

interface GuildSuccess extends BaseGuild {
  success: true;
  guild: {
    guildName: string;
    createdAt: Date;
    balance: bigint;
    xp: bigint;
    tokens: number;
    level: number;
    motd: string;
    owner: {
      user: {
        lastKnownUsername: string;
      };
    };
    members: {
      economy: {
        user: {
          lastKnownUsername: string;
        };
      };
      joinedAt: Date;
      contributedMoney: bigint;
      contributedXp: number;
    }[];
  };
}

export type Guild = GuildSuccess | GuildError;
