import { dev } from "$app/environment";
import {
  DISCORD_OAUTH_CLIENTID,
  DISCORD_OAUTH_REDIRECT,
  DISCORD_OAUTH_SECRET,
} from "$env/static/private";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Discord } from "arctic";
import { Lucia } from "lucia";
import prisma from "../database";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.lastKnownUsername,
      avatar: attributes.avatar,
    };
  },
});

export const discord = new Discord(
  DISCORD_OAUTH_CLIENTID,
  DISCORD_OAUTH_SECRET,
  DISCORD_OAUTH_REDIRECT,
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  lastKnownUsername: string;
  avatar: string;
}
