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
    const residentId = formData.get('residentId') as string;
    const templateId = formData.get('templateId') as string;
    const dueDate = formData.get('dueDate') as string;
    const shift = formData.get('shift') as 'AM' | 'PM';

    if (!residentId || !templateId || !dueDate || !shift) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify resident exists and is active
    const resident = await prisma.user.findUnique({
      where: { id: residentId },
    });

    if (!resident || resident.role !== 'RESIDENT' || !resident.isActive) {
      return NextResponse.json(
        { error: 'Invalid resident' },
        { status: 400 }
      );
    }

    // Verify template exists
    const template = await prisma.choreTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template || !template.isActive) {
      return NextResponse.json(
        { error: 'Invalid chore template' },
        { status: 400 }
      );
    }

    // Create assignment
    const assignment = await prisma.choreAssignment.create({
      data: {
        templateId,
        assignedToId: residentId,
        assignedById: session.userId,
        dueDate: new Date(dueDate),
        shift,
        status: 'ASSIGNED',
      },
    });

    // Log activity
    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        action: 'CHORE_ASSIGNED',
        targetType: 'ChoreAssignment',
        targetId: assignment.id,
        metaJson: JSON.stringify({
          residentId,
          templateId,
          dueDate,
          shift,
        }),
      },
    });

    return NextResponse.redirect(new URL('/chores', request.url));
  } catch (error) {
    console.error('Chore assignment error:', error);
    return NextResponse.json(
      { error: 'Failed to assign chore' },
      { status: 500 }
    );
  }
}
