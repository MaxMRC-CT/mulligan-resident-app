import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.userId || (session.role !== 'STAFF' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const submissionId = formData.get('submissionId') as string;
    const action = formData.get('action') as 'approve' | 'reject';
    const reviewNote = formData.get('reviewNote') as string | null;

    if (!submissionId || !action) {
      return NextResponse.json(
        { error: 'Submission ID and action are required' },
        { status: 400 }
      );
    }

    // Get submission
    const submission = await prisma.choreSubmission.findUnique({
      where: { id: submissionId },
      include: { assignment: true },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    if (submission.reviewedAt) {
      return NextResponse.json(
        { error: 'Submission already reviewed' },
        { status: 400 }
      );
    }

    // Update submission
    await prisma.choreSubmission.update({
      where: { id: submissionId },
      data: {
        reviewedById: session.userId,
        reviewedAt: new Date(),
        reviewNote: reviewNote || null,
      },
    });

    // Update assignment status
    const newStatus = action === 'approve' ? 'APPROVED' : 'NEEDS_REDO';
    await prisma.choreAssignment.update({
      where: { id: submission.assignmentId },
      data: { status: newStatus },
    });

    // Log activity
    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        action: `CHORE_${action.toUpperCase()}D`,
        targetType: 'ChoreSubmission',
        targetId: submissionId,
      },
    });

    return NextResponse.redirect(new URL('/chores', request.url));
  } catch (error) {
    console.error('Chore review error:', error);
    return NextResponse.json(
      { error: 'Failed to review chore' },
      { status: 500 }
    );
  }
}
