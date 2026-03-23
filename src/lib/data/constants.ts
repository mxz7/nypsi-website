export const Constants = {
  SNOWFLAKE_REGEX: /^\d{17,19}$/,
} as const;

export const RedisKey = {
  users: {
    USERNAME_TO_ID: "cache:usernametoid",
    BASE_DATA: "cache:user:basedata",
    COMMAND_USES: "cache:user:commanduses",
    ACHIEVEMENTS: "cache:user:achievements",
    MARRIAGE_PARTNER: "cache:user:marriagepartner",
    INVENTORY: "cache:user:inventory",
    MUSEUM: "cache:user:museum",
  },
  data: {
    ACHIEVEMENTS: "cache:achievements",
  },
};
