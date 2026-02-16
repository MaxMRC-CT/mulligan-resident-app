import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

async function getDashboardData(userId: string, role: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get announcements
  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { audience: 'ALL' },
        { audience: role === 'RESIDENT' ? 'RESIDENTS' : 'STAFF' }
      ]
    },
    include: {
      author: { select: { displayName: true, username: true } },
      acknowledgements: {
        where: { userId }
      }
    },
    orderBy: [
      { pinned: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 10
  });

  // Get today's chores (only for residents)
  let todayChores = [];
  if (role === 'RESIDENT') {
    todayChores = await prisma.choreAssignment.findMany({
      where: {
        assignedToId: userId,
        dueDate: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        template: true,
        submissions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { shift: 'asc' }
    });
  }

  // Get today's meetings
  const dayOfWeek = today.getDay();
  const meetingPlans = await prisma.meetingPlan.findMany({
    where: {
      userId,
      date: today
    },
    include: {
      meeting: true
    },
    orderBy: {
      meeting: { startTime: 'asc' }
    }
  });

  return { announcements, todayChores, meetingPlans };
}

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session.userId) {
    redirect('/login');
  }

  const { announcements, todayChores, meetingPlans } = await getDashboardData(
    session.userId,
    session.role
  );

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {session.displayName || session.username}
        </h1>
        <p className="text-gray-600 mt-1">{today}</p>
      </div>

      {/* Daily Planner Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Announcements Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📢 Announcements</h2>
            {announcements.length === 0 ? (
              <p className="text-gray-500 italic">No announcements at this time.</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`border-l-4 pl-4 py-2 ${
                      announcement.pinned ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {announcement.pinned && '📌 '}
                          {announcement.title}
                        </h3>
                        <p className="text-gray-700 mt-1 whitespace-pre-wrap">{announcement.body}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          By {announcement.author.displayName || announcement.author.username} • {' '}
                          {format(new Date(announcement.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      {announcement.acknowledgements.length === 0 && (
                        <form action="/api/announcements/acknowledge" method="POST">
                          <input type="hidden" name="announcementId" value={announcement.id} />
                          <button
                            type="submit"
                            className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark as Read
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Schedule/Meetings */}
          {session.role === 'RESIDENT' && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">📅 Today's Schedule</h2>
                <a
                  href="/schedule/add"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Work Shift
                </a>
              </div>
              
              {meetingPlans.length === 0 ? (
                <p className="text-gray-500 italic">No meetings scheduled for today.</p>
              ) : (
                <div className="space-y-3">
                  {meetingPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{plan.meeting.name}</p>
                        <p className="text-sm text-gray-600">
                          {plan.meeting.startTime} • {plan.meeting.location}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        plan.status === 'ATTENDED' ? 'bg-green-100 text-green-800' :
                        plan.status === 'NO_SHOW' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Today's Chores */}
        {session.role === 'RESIDENT' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Today's Chores</h2>
              
              {todayChores.length === 0 ? (
                <p className="text-gray-500 italic">No chores assigned for today.</p>
              ) : (
                <div className="space-y-4">
                  {todayChores.map((chore) => {
                    const latestSubmission = chore.submissions[0];
                    const isSubmitted = latestSubmission !== undefined;
                    
                    return (
                      <div key={chore.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{chore.template.title}</h3>
                            <p className="text-sm text-gray-600">{chore.shift} Shift</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            chore.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            chore.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                            chore.status === 'NEEDS_REDO' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {chore.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{chore.template.description}</p>
                        
                        {chore.status === 'NEEDS_REDO' && latestSubmission?.reviewNote && (
                          <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                            <p className="text-sm text-red-800">
                              <strong>Staff Notes:</strong> {latestSubmission.reviewNote}
                            </p>
                          </div>
                        )}
                        
                        {!isSubmitted || chore.status === 'NEEDS_REDO' ? (
                          <a
                            href={`/chores/${chore.id}/submit`}
                            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            {chore.status === 'NEEDS_REDO' ? 'Resubmit Chore' : 'Complete & Submit'}
                          </a>
                        ) : chore.status === 'SUBMITTED' ? (
                          <div className="text-center text-sm text-gray-600">
                            ⏳ Awaiting staff review
                          </div>
                        ) : (
                          <div className="text-center text-sm text-green-600">
                            ✓ Completed and approved
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Links for Staff/Admin */}
      {(session.role === 'STAFF' || session.role === 'ADMIN') && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/chores"
              className="p-4 border rounded-lg hover:bg-gray-50 transition text-center"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium">Manage Chores</div>
            </a>
            <a
              href="/announcements/new"
              className="p-4 border rounded-lg hover:bg-gray-50 transition text-center"
            >
              <div className="text-2xl mb-2">📢</div>
              <div className="text-sm font-medium">New Announcement</div>
            </a>
            <a
              href="/residents"
              className="p-4 border rounded-lg hover:bg-gray-50 transition text-center"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium">Residents</div>
            </a>
            {session.role === 'ADMIN' && (
              <a
                href="/admin"
                className="p-4 border rounded-lg hover:bg-gray-50 transition text-center"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm font-medium">Admin Panel</div>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
