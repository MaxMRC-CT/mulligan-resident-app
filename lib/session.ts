import { SessionOptions, getIronSession } from 'iron-session';
import { Role } from '@prisma/client';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  username: string;
  role: Role;
  displayName?: string;
  mustChangePassword: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'mulligan-dev-secret-change-in-production-min-32-chars',
  cookieName: 'mulligan-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
