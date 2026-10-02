import { beforeEach, describe, expect, it, vi } from "vitest";

const environment = vi.hoisted(() => ({ building: false }));
vi.mock("$app/env", () => environment);

const requiredNames = [
  "BOT_SERVER_URL",
  "BOT_API_AUTH",
  "HCAPTCHA_SECRET",
  "PUBLIC_HCAPTCHA_SITEKEY",
  "TOPGG_TOKEN",
  "PUBLIC_URL",
  "DATABASE_URL",
  "DISCORD_OAUTH_CLIENTID",
  "DISCORD_OAUTH_SECRET",
  "DISCORD_OAUTH_REDIRECT",
] as const;

describe("environment configuration", () => {
  beforeEach(() => {
    environment.building = false;
    vi.resetModules();
  });

  it("rejects missing and empty required values at runtime", async () => {
    const { variables } = await import("../src/env");
    for (const name of requiredNames) {
      const schema = variables[name].schema;
      expect(schema.safeParse(undefined).success, name).toBe(false);
      expect(schema.safeParse("").success, name).toBe(false);
      expect(schema.safeParse("configured").success, name).toBe(true);
    }
  });

  it("allows Redis and Loki to be unconfigured", async () => {
    const { variables } = await import("../src/env");
    for (const name of ["REDIS_URL", "LOKI_HOST", "LOKI_USERNAME", "LOKI_PASSWORD"] as const) {
      expect(await variables[name].schema["~standard"].validate(undefined)).toEqual({ value: "" });
    }
  });

  it("allows builds without service credentials", async () => {
    environment.building = true;
    const { variables } = await import("../src/env");
    for (const name of requiredNames) {
      expect(variables[name].schema.parse(undefined), name).toBe("");
    }
  });
});
