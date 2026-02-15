import { PrismaClient, Role, AnnouncementAudience, ChoreShift, MeetingType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.meetingPlan.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.choreSubmission.deleteMany();
  await prisma.choreAssignment.deleteMany();
  await prisma.choreTemplate.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.announcementAck.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      displayName: 'Admin User',
      mustChangePassword: false,
      isActive: true,
    },
  });

  const staff = await prisma.user.create({
    data: {
      username: 'staff',
      passwordHash: hashedPassword,
      role: Role.STAFF,
      displayName: 'Staff Member',
      mustChangePassword: false,
      isActive: true,
    },
  });

  const resident1 = await prisma.user.create({
    data: {
      username: 'jdoe',
      passwordHash: hashedPassword,
      role: Role.RESIDENT,
      displayName: 'John Doe',
      mustChangePassword: true,
      isActive: true,
    },
  });

  const resident2 = await prisma.user.create({
    data: {
      username: 'asmith',
      passwordHash: hashedPassword,
      role: Role.RESIDENT,
      displayName: 'Alice Smith',
      mustChangePassword: true,
      isActive: true,
    },
  });

  console.log('✓ Created users (admin, staff, jdoe, asmith)');
  console.log('  → Default password for all: Password123!');

  // Create announcements
  const announcement1 = await prisma.announcement.create({
    data: {
      title: 'Welcome to Mulligan Recovery Centers',
      body: 'Welcome to our resident portal. This app will help you stay connected with staff, complete daily chores, plan meeting attendance, and maintain your personal journal. If you need immediate assistance, please speak with staff directly. This app is not for emergencies.',
      pinned: true,
      audience: AnnouncementAudience.ALL,
      authorId: admin.id,
    },
  });

  const announcement2 = await prisma.announcement.create({
    data: {
      title: 'House Meeting Tonight',
      body: 'Reminder: House meeting tonight at 7 PM in the common room. Attendance is mandatory.',
      pinned: false,
      audience: AnnouncementAudience.RESIDENTS,
      authorId: staff.id,
    },
  });

  const announcement3 = await prisma.announcement.create({
    data: {
      title: 'Staff Training Update',
      body: 'Staff training on new protocols scheduled for Friday at 2 PM.',
      pinned: false,
      audience: AnnouncementAudience.STAFF,
      authorId: admin.id,
    },
  });

  console.log('✓ Created 3 announcements');

  // Create message threads for residents
  const thread1 = await prisma.messageThread.create({
    data: {
      residentId: resident1.id,
    },
  });

  const thread2 = await prisma.messageThread.create({
    data: {
      residentId: resident2.id,
    },
  });

  // Create sample messages
  await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: resident1.id,
      body: 'Hi, I have a question about my chore schedule.',
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: staff.id,
      body: 'Sure! What would you like to know?',
    },
  });

  console.log('✓ Created message threads and sample messages');

  // Create chore templates
  const choreKitchen = await prisma.choreTemplate.create({
    data: {
      title: 'Kitchen Cleanup',
      description: 'Clean kitchen counters, sink, and sweep floor. Take before/after photos.',
      isActive: true,
    },
  });

  const choreBathroom = await prisma.choreTemplate.create({
    data: {
      title: 'Bathroom Cleaning',
      description: 'Clean bathroom fixtures, mirrors, and mop floor. Restock supplies if needed.',
      isActive: true,
    },
  });

  const choreVacuum = await prisma.choreTemplate.create({
    data: {
      title: 'Vacuum Common Areas',
      description: 'Vacuum all common area carpets and furniture.',
      isActive: true,
    },
  });

  console.log('✓ Created 3 chore templates');

  // Create chore assignments
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.choreAssignment.create({
    data: {
      templateId: choreKitchen.id,
      assignedToId: resident1.id,
      assignedById: staff.id,
      dueDate: today,
      shift: ChoreShift.AM,
      status: 'ASSIGNED',
    },
  });

  await prisma.choreAssignment.create({
    data: {
      templateId: choreBathroom.id,
      assignedToId: resident2.id,
      assignedById: staff.id,
      dueDate: today,
      shift: ChoreShift.PM,
      status: 'ASSIGNED',
    },
  });

  await prisma.choreAssignment.create({
    data: {
      templateId: choreVacuum.id,
      assignedToId: resident1.id,
      assignedById: staff.id,
      dueDate: new Date(today.getTime() + 86400000), // Tomorrow
      shift: ChoreShift.AM,
      status: 'ASSIGNED',
    },
  });

  console.log('✓ Created chore assignments');

  // Create meetings
  await prisma.meeting.create({
    data: {
      type: MeetingType.AA,
      name: 'Monday Night AA',
      location: 'St. Mary\'s Church, 123 Main St',
      dayOfWeek: 1, // Monday
      startTime: '19:00',
      notes: 'Open meeting, beginners welcome',
      isActive: true,
    },
  });

  await prisma.meeting.create({
    data: {
      type: MeetingType.AA,
      name: 'Wednesday Morning AA',
      location: 'Community Center, 456 Oak Ave',
      dayOfWeek: 3, // Wednesday
      startTime: '10:00',
      notes: 'Closed meeting',
      isActive: true,
    },
  });

  await prisma.meeting.create({
    data: {
      type: MeetingType.NA,
      name: 'Friday Night NA',
      location: 'Hope Center, 789 Elm St',
      dayOfWeek: 5, // Friday
      startTime: '20:00',
      notes: 'Speaker meeting',
      isActive: true,
    },
  });

  await prisma.meeting.create({
    data: {
      type: MeetingType.AA,
      name: 'Sunday Morning AA',
      location: 'First Presbyterian Church, 321 Church Rd',
      dayOfWeek: 0, // Sunday
      startTime: '09:00',
      notes: 'Step study',
      isActive: true,
    },
  });

  console.log('✓ Created 4 meetings');

  // Create sample journal entries
  await prisma.journalEntry.create({
    data: {
      userId: resident1.id,
      body: 'Today was a good day. I feel grateful for the support I\'m receiving here.',
      mood: 4,
      shareWithStaff: false,
    },
  });

  await prisma.journalEntry.create({
    data: {
      userId: resident1.id,
      body: 'Struggled a bit today with cravings, but I talked to my sponsor and feel better.',
      mood: 3,
      shareWithStaff: true,
    },
  });

  console.log('✓ Created sample journal entries');

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'USER_CREATED',
      targetType: 'User',
      targetId: resident1.id,
      metaJson: JSON.stringify({ role: 'RESIDENT', username: 'jdoe' }),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: staff.id,
      action: 'ANNOUNCEMENT_CREATED',
      targetType: 'Announcement',
      targetId: announcement2.id,
    },
  });

  console.log('✓ Created audit logs');

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin:     username: admin    | password: Password123!');
  console.log('   Staff:     username: staff    | password: Password123!');
  console.log('   Resident:  username: jdoe     | password: Password123!');
  console.log('   Resident:  username: asmith   | password: Password123!');
  console.log('\n⚠️  Residents will be prompted to change password on first login\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
