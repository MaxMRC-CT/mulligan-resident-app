import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

async function getChoresData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all residents
  const residents = await prisma.user.findMany({
    where: { role: 'RESIDENT', isActive: true },
    select: { id: true, displayName: true, username: true },
    orderBy: { displayName: 'asc' }
  });

  // Get chore templates
  const templates = await prisma.choreTemplate.findMany({
    where: { isActive: true },
    orderBy: { title: 'asc' }
  });

  // Get today's assignments
  const assignments = await prisma.choreAssignment.findMany({
    where: {
      dueDate: {
        gte: today
      }
    },
    include: {
      assignedTo: { select: { displayName: true, username: true } },
      template: true,
      submissions: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: [
      { dueDate: 'asc' },
      { shift: 'asc' }
    ],
    take: 50
  });

  // Get pending reviews
  const pendingReviews = await prisma.choreSubmission.findMany({
    where: {
      reviewedAt: null,
      assignment: {
        status: 'SUBMITTED'
      }
    },
    include: {
      assignment: {
        include: {
          template: true,
          assignedTo: { select: { displayName: true, username: true } }
        }
      },
      submittedBy: { select: { displayName: true, username: true } }
    },
    orderBy: { createdAt: 'asc' }
  });

  return { residents, templates, assignments, pendingReviews };
}

export default async function ChoresPage() {
  const session = await getSession();
  
  if (!session.userId) {
    redirect('/login');
  }

  if (session.role === 'RESIDENT') {
    redirect('/dashboard');
  }

  const { residents, templates, assignments, pendingReviews } = await getChoresData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Chore Management</h1>
        <a
          href="/chores/templates"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Manage Templates
        </a>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ⏳ Pending Reviews ({pendingReviews.length})
          </h2>
          <div className="space-y-4">
            {pendingReviews.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg p-4 border">
                <div className="flex items-start gap-4">
                  <img
                    src={submission.photoUrl}
                    alt="Chore completion photo"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {submission.assignment.template.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      By {submission.submittedBy.displayName || submission.submittedBy.username} •{' '}
                      {format(new Date(submission.createdAt), 'MMM d, h:mm a')}
                    </p>
                    {submission.note && (
                      <p className="text-sm text-gray-700 mt-2">
                        <strong>Note:</strong> {submission.note}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <form action="/api/chores/review" method="POST" className="inline">
                        <input type="hidden" name="submissionId" value={submission.id} />
                        <input type="hidden" name="action" value="approve" />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                        >
                          ✓ Approve
                        </button>
                      </form>
                      <a
                        href={`/chores/submissions/${submission.id}/review`}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                      >
                        ✗ Request Redo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign New Chores */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assign New Chores</h2>
        <form action="/api/chores/assign" method="POST" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resident
              </label>
              <select
                name="residentId"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select resident...</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.displayName || resident.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chore
              </label>
              <select
                name="templateId"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select chore...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shift
              </label>
              <select
                name="shift"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Assign Chore
          </button>
        </form>
      </div>

      {/* Current Assignments */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Assignments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chore
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Shift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.assignedTo.displayName || assignment.assignedTo.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.template.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.shift}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assignment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                      assignment.status === 'NEEDS_REDO' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {assignment.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
