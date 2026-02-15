import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from './session';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.userId) {
    redirect('/login');
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.role)) {
    redirect('/unauthorized');
  }
  
  return session;
}

export async function requireStaffOrAdmin() {
  return requireRole([Role.STAFF, Role.ADMIN]);
}

export async function requireAdmin() {
  return requireRole([Role.ADMIN]);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId) {
    return null;
  }
  return session;
}
