import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.userId || session.role !== 'RESIDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const assignmentId = formData.get('assignmentId') as string;
    const photo = formData.get('photo') as File;
    const note = formData.get('note') as string | null;

    if (!assignmentId || !photo) {
      return NextResponse.json(
        { error: 'Assignment ID and photo are required' },
        { status: 400 }
      );
    }

    // Verify assignment belongs to this user
    const assignment = await prisma.choreAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment || assignment.assignedToId !== session.userId) {
      return NextResponse.json({ error: 'Invalid assignment' }, { status: 403 });
    }

    // Save photo
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const choresDir = join(uploadDir, 'chores');
    
    if (!existsSync(choresDir)) {
      await mkdir(choresDir, { recursive: true });
    }

    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const filename = `${assignment.id}_${timestamp}_${photo.name}`;
    const filepath = join(choresDir, filename);
    
    await writeFile(filepath, buffer);
    const photoUrl = `/uploads/chores/${filename}`;

    // Create submission
    const submission = await prisma.choreSubmission.create({
      data: {
        assignmentId,
        submittedById: session.userId,
        photoUrl,
        note: note || null,
      },
    });

    // Update assignment status
    await prisma.choreAssignment.update({
      where: { id: assignmentId },
      data: { status: 'SUBMITTED' },
    });

    // Log activity
    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        action: 'CHORE_SUBMITTED',
        targetType: 'ChoreAssignment',
        targetId: assignmentId,
      },
    });

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Chore submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit chore' },
      { status: 500 }
    );
  }
}
