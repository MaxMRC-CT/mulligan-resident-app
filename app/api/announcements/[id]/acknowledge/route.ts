import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // Check if already acknowledged
    const existing = await prisma.announcementAck.findUnique({
      where: {
        announcementId_userId: {
          announcementId: id,
          userId: session.userId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, alreadyAcknowledged: true });
    }

    // Create acknowledgement
    await prisma.announcementAck.create({
      data: {
        announcementId: id,
        userId: session.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Acknowledge announcement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
