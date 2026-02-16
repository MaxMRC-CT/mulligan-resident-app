import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

async function getAdminData() {
  const users = await prisma.user.findMany({
    orderBy: [
      { role: 'asc' },
      { displayName: 'asc' }
    ],
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true,
      isActive: true,
      messagingDisabled: true,
      createdAt: true,
      _count: {
        select: {
          assignedChores: true,
          sentMessages: true
        }
      }
    }
  });

  const stats = {
    totalUsers: users.length,
    activeResidents: users.filter(u => u.role === 'RESIDENT' && u.isActive).length,
    staff: users.filter(u => u.role === 'STAFF').length,
    admins: users.filter(u => u.role === 'ADMIN').length
  };

  const recentActivity = await prisma.auditLog.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: { displayName: true, username: true }
      }
    }
  });

  return { users, stats, recentActivity };
}

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session.userId) {
    redirect('/login');
  }

  if (session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const { users, stats, recentActivity } = await getAdminData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm text-gray-600">Active Residents</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">{stats.activeResidents}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm text-gray-600">Staff Members</div>
          <div className="text-3xl font-bold text-green-600 mt-1">{stats.staff}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm text-gray-600">Administrators</div>
          <div className="text-3xl font-bold text-purple-600 mt-1">{stats.admins}</div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <a
            href="/admin/users/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Add User
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.displayName || user.username}
                    </div>
                    <div className="text-sm text-gray-500">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'STAFF' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 text-xs rounded-full inline-block ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {user.messagingDisabled && (
                        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 inline-block">
                          Messaging Disabled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role === 'RESIDENT' && (
                      <div>
                        {user._count.assignedChores} chores assigned
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`/admin/users/${user.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </a>
                    <form action="/api/admin/users/toggle-active" method="POST" className="inline">
                      <input type="hidden" name="userId" value={user.id} />
                      <button
                        type="submit"
                        className={user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {recentActivity.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {log.actor.displayName || log.actor.username}
                </span>
                <span className="text-sm text-gray-600"> {log.action}</span>
                {log.targetType && (
                  <span className="text-sm text-gray-500"> ({log.targetType})</span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/chore-templates"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="font-medium text-gray-900">Chore Templates</div>
            <div className="text-sm text-gray-600">Manage chore types and descriptions</div>
          </a>
          <a
            href="/admin/meetings"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="font-medium text-gray-900">Meetings</div>
            <div className="text-sm text-gray-600">Configure AA/NA meetings and schedules</div>
          </a>
          <a
            href="/admin/audit-logs"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="font-medium text-gray-900">Audit Logs</div>
            <div className="text-sm text-gray-600">View detailed system activity logs</div>
          </a>
          <a
            href="/admin/backups"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="font-medium text-gray-900">Backups</div>
            <div className="text-sm text-gray-600">Database backup and restore</div>
          </a>
        </div>
      </div>
    </div>
  );
}
