import { dev } from "$app/environment";
import type { Session, User } from "$lib/types/Auth";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import type { Cookies } from "@sveltejs/kit";
import prisma from "../database";
import redis from "../redis";

const SESSION_EXPIRY_UPDATE_WINDOW = 1000 * 60 * 60 * 24 * 15;
const SESSION_EXPIRY_EXTENSION = 1000 * 60 * 60 * 24 * 30;
const SESSION_TTL = 1000 * 60 * 60 * 24 * 30;

const COOKIE_NAME = "auth_session";

export async function createSession(userId: string) {
  const token = generateSessionToken();

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + SESSION_TTL);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  });

  return { sessionId, expiresAt, token };
}

function generateSessionToken() {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);

  return encodeBase32LowerCaseNoPadding(tokenBytes);
}

export async function invalidateSession(sessionId: string) {
  await prisma.session.delete({ where: { id: sessionId } });
  await redis.del(`cache:session:${sessionId}`);
}

export async function validateSession(token: string): Promise<{
  session: Session;
  user: User;
} | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const cache = await redis.get(`cache:session:${sessionId}`);

  if (cache) {
    const data = JSON.parse(cache);

    data.user.lastCommand = new Date(data.user.lastCommand);
    data.session.expiresAt = new Date(data.session.expiresAt);

    return data;
  }

  const sessionWithUser = await prisma.session.findFirst({
    where: {
      id: sessionId,
    },
    include: {
      user: {
        select: {
          id: true,
          lastCommand: true,
          avatar: true,
          lastKnownUsername: true,
          adminLevel: true,
        },
      },
    },
  });

  if (!sessionWithUser) {
    return null;
  }

  const { user, ...session } = sessionWithUser;

  const now = Date.now();
  const hasExpired = now >= session.expiresAt.getTime();
  if (hasExpired) {
    await prisma.session.delete({ where: { id: sessionId } });
    return null;
  }

  const isCloseToExpiry = now >= session.expiresAt.getTime() - SESSION_EXPIRY_UPDATE_WINDOW;
  if (isCloseToExpiry) {
    const newExpiresAt = await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: new Date(now + SESSION_EXPIRY_EXTENSION) },
    });

    session.expiresAt = newExpiresAt.expiresAt;
  }

  await redis.set(`cache:session:${sessionId}`, JSON.stringify({ session, user }), "EX", 86400);

  return { session, user };
}

export function setSessionCookie(cookies: Cookies, token: string, expiresAt: Date) {
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    secure: !dev,
    sameSite: "lax",
    expires: expiresAt,
  });
}

export function getSessionCookie(cookies: Cookies) {
  return cookies.get(COOKIE_NAME);
}

export function deleteSessionCookie(cookies: Cookies) {
  cookies.delete(COOKIE_NAME, { path: "/" });
}
