import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await requireAuth();

    // Determine audience filter
    let audienceFilter;
    if (session.role === Role.RESIDENT) {
      audienceFilter = { audience: { in: ['ALL', 'RESIDENTS'] } };
    } else {
      audienceFilter = { audience: { in: ['ALL', 'STAFF'] } };
    }

    const announcements = await prisma.announcement.findMany({
      where: audienceFilter,
      include: {
        author: {
          select: {
            displayName: true,
            username: true,
          },
        },
        acknowledgements: {
          where: {
            userId: session.userId,
          },
        },
        _count: {
          select: {
            acknowledgements: true,
          },
        },
      },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const mapped = announcements.map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      pinned: a.pinned,
      audience: a.audience,
      author: a.author.displayName || a.author.username,
      createdAt: a.createdAt.toISOString(),
      hasAcknowledged: a.acknowledgements.length > 0,
      ackCount: a._count.acknowledgements,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Get announcements error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
