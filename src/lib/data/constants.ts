export const Constants = {
  SNOWFLAKE_REGEX: /^\d{17,19}$/,
} as const;

export const RedisKey = {
  users: {
    USERNAME_TO_ID: "cache:usernametoid",
  },
  data: {
    ACHIEVEMENTS: "cache:achievements",
  },
};
