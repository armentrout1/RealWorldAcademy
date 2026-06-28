import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import type { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);
const keyLength = 64;

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export type SafeUser = Omit<User, "password">;

export function toSafeUser(user: User): SafeUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = (await scryptAsync(password, salt, keyLength)) as Buffer;
  return `scrypt:${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  const [scheme, salt, storedKey] = storedPassword.split(":");

  if (scheme !== "scrypt" || !salt || !storedKey) {
    return false;
  }

  const storedBuffer = Buffer.from(storedKey, "hex");
  const suppliedBuffer = (await scryptAsync(password, salt, storedBuffer.length)) as Buffer;

  return storedBuffer.length === suppliedBuffer.length && timingSafeEqual(storedBuffer, suppliedBuffer);
}
