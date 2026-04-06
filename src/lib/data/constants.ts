export const Constants = {
  SNOWFLAKE_REGEX: /^\d{17,19}$/,
  MARKDOWN_LINK_REGEX: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
} as const;

export const RedisKey = {
  guilds: {
    GUILD_BY_NAME: "cache:guild:byname",
  },
  users: {
    USERNAME_TO_ID: "cache:usernametoid",
    BASE_DATA: "cache:user:basedata",
    COMMAND_USES: "cache:user:commanduses",
    ACHIEVEMENTS: "cache:user:achievements",
    MARRIAGE_PARTNER: "cache:user:marriagepartner",
    INVENTORY: "cache:user:inventory",
    MUSEUM: "cache:user:museum",
    PRIVACY: "cache:user:privacy",
    ACTIVE_TAG: "cache:user:activetag",
  },
  data: {
    ACHIEVEMENTS: "cache:achievements",
  },
  leaderboards: {
    DATA: "cache:leaderboard",
  },
};
