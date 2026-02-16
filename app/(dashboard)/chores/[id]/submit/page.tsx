import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

async function getChoreAssignment(assignmentId: string, userId: string) {
  const assignment = await prisma.choreAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      template: true,
      submissions: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!assignment || assignment.assignedToId !== userId) {
    return null;
  }

  return assignment;
}

export default async function ChoreSubmitPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getSession();
  
  if (!session.userId) {
    redirect('/login');
  }

  if (session.role !== 'RESIDENT') {
    redirect('/dashboard');
  }

  const assignment = await getChoreAssignment(params.id, session.userId);

  if (!assignment) {
    redirect('/dashboard');
  }

  const latestSubmission = assignment.submissions[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <a href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Dashboard
        </a>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Complete Chore</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {assignment.template.title}
        </h2>
        <p className="text-gray-600 mb-1">{assignment.shift} Shift</p>
        <p className="text-gray-700">{assignment.template.description}</p>

        {assignment.status === 'NEEDS_REDO' && latestSubmission?.reviewNote && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded p-4">
            <h3 className="font-semibold text-red-900 mb-2">Staff Feedback:</h3>
            <p className="text-red-800">{latestSubmission.reviewNote}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Completion</h2>
        
        <form action="/api/chores/submit" method="POST" encType="multipart/form-data" className="space-y-4">
          <input type="hidden" name="assignmentId" value={assignment.id} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Take a photo showing the completed chore
            </p>
            <input
              type="file"
              name="photo"
              accept="image/*"
              capture="environment"
              required
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="note"
              rows={3}
              placeholder="Any additional comments..."
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            >
              Submit Chore
            </button>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📸 Photo Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Make sure the area is well-lit</li>
          <li>• Show the entire completed area</li>
          <li>• Photo should clearly show the work was completed</li>
          <li>• Avoid blurry or dark photos</li>
        </ul>
      </div>
    </div>
  );
}
