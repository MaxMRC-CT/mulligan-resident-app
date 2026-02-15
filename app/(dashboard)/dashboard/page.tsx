import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';
import Link from 'next/link';
import { Role } from '@prisma/client';

export default async function DashboardPage() {
  const session = await requireAuth();

  // Get quick stats based on role
  const stats = await getStats(session.userId, session.role);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mulligan-warm-gray mb-2">
          Welcome back, {session.displayName || session.username}!
        </h1>
        <p className="text-gray-600">
          {session.role === Role.RESIDENT
            ? "Here's what's happening today"
            : 'Dashboard overview'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unread Announcements</p>
              <p className="text-3xl font-bold text-mulligan-orange">
                {stats.unreadAnnouncements}
              </p>
            </div>
            <div className="w-12 h-12 bg-mulligan-orange/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">📢</span>
            </div>
          </div>
          <Link
            href="/announcements"
            className="mt-4 text-sm text-mulligan-orange hover:underline inline-block"
          >
            View announcements →
          </Link>
        </Card>

        {session.role === Role.RESIDENT && (
          <>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Chores Today</p>
                  <p className="text-3xl font-bold text-mulligan-orange">
                    {stats.choresToday}
                  </p>
                </div>
                <div className="w-12 h-12 bg-mulligan-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
              <Link
                href="/chores"
                className="mt-4 text-sm text-mulligan-orange hover:underline inline-block"
              >
                View chores →
              </Link>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Planned Meetings</p>
                  <p className="text-3xl font-bold text-mulligan-orange">
                    {stats.upcomingMeetings}
                  </p>
                </div>
                <div className="w-12 h-12 bg-mulligan-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
              <Link
                href="/meetings"
                className="mt-4 text-sm text-mulligan-orange hover:underline inline-block"
              >
                View meetings →
              </Link>
            </Card>
          </>
        )}

        {(session.role === Role.STAFF || session.role === Role.ADMIN) && (
          <>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Chores</p>
                  <p className="text-3xl font-bold text-mulligan-orange">
                    {stats.pendingChores}
                  </p>
                </div>
                <div className="w-12 h-12 bg-mulligan-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
              <Link
                href="/chores"
                className="mt-4 text-sm text-mulligan-orange hover:underline inline-block"
              >
                Review chores →
              </Link>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Residents</p>
                  <p className="text-3xl font-bold text-mulligan-orange">
                    {stats.activeResidents}
                  </p>
                </div>
                <div className="w-12 h-12 bg-mulligan-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-mulligan-warm-gray mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/announcements"
              className="block p-3 rounded-lg hover:bg-mulligan-soft-gray transition-colors"
            >
              <p className="font-medium">View Announcements</p>
              <p className="text-sm text-gray-600">Stay updated with house news</p>
            </Link>
            {session.role === Role.RESIDENT && (
              <>
                <Link
                  href="/chores"
                  className="block p-3 rounded-lg hover:bg-mulligan-soft-gray transition-colors"
                >
                  <p className="font-medium">Complete Chores</p>
                  <p className="text-sm text-gray-600">Upload proof and track completion</p>
                </Link>
                <Link
                  href="/journal"
                  className="block p-3 rounded-lg hover:bg-mulligan-soft-gray transition-colors"
                >
                  <p className="font-medium">Write in Journal</p>
                  <p className="text-sm text-gray-600">Private reflection and notes</p>
                </Link>
              </>
            )}
            {(session.role === Role.STAFF || session.role === Role.ADMIN) && (
              <Link
                href="/admin"
                className="block p-3 rounded-lg hover:bg-mulligan-soft-gray transition-colors"
              >
                <p className="font-medium">Admin Console</p>
                <p className="text-sm text-gray-600">Manage users and settings</p>
              </Link>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-mulligan-warm-gray mb-4">
            Important Reminders
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium text-sm">Emergency Notice</p>
                <p className="text-xs text-gray-600">
                  This app is not for emergencies. Speak with staff directly for immediate assistance.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">📱</span>
              <div>
                <p className="font-medium text-sm">Check In Daily</p>
                <p className="text-xs text-gray-600">
                  Review announcements and complete assigned chores each day.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="font-medium text-sm">Privacy Notice</p>
                <p className="text-xs text-gray-600">
                  Your journal entries are private unless you choose to share them with staff.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

async function getStats(userId: string, role: Role) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (role === Role.RESIDENT) {
    const [unreadCount, choresCount, meetingsCount] = await Promise.all([
      prisma.announcement.count({
        where: {
          audience: { in: ['ALL', 'RESIDENTS'] },
          acknowledgements: {
            none: {
              userId,
            },
          },
        },
      }),
      prisma.choreAssignment.count({
        where: {
          assignedToId: userId,
          dueDate: {
            gte: today,
            lt: tomorrow,
          },
          status: 'ASSIGNED',
        },
      }),
      prisma.meetingPlan.count({
        where: {
          userId,
          date: {
            gte: today,
          },
          status: 'PLANNED',
        },
      }),
    ]);

    return {
      unreadAnnouncements: unreadCount,
      choresToday: choresCount,
      upcomingMeetings: meetingsCount,
    };
  } else {
    const [unreadCount, pendingCount, residentCount] = await Promise.all([
      prisma.announcement.count({
        where: {
          audience: { in: ['ALL', 'STAFF'] },
          acknowledgements: {
            none: {
              userId,
            },
          },
        },
      }),
      prisma.choreAssignment.count({
        where: {
          status: 'SUBMITTED',
        },
      }),
      prisma.user.count({
        where: {
          role: Role.RESIDENT,
          isActive: true,
        },
      }),
    ]);

    return {
      unreadAnnouncements: unreadCount,
      pendingChores: pendingCount,
      activeResidents: residentCount,
    };
  }
}
