# Mulligan Resident App MVP

A mobile-first resident portal for Mulligan Recovery Centers supporting announcements, messaging, chores accountability, AA/NA meeting planning, and private journaling.

**⚠️ IMPORTANT: This app stores NO PHI (Protected Health Information)**

## Features

### For Residents
- ✅ View and acknowledge announcements
- 💬 Direct messaging with staff (staff-initiated responses)
- 📋 Chore assignments with photo proof upload
- 📅 AA/NA meeting planning and attendance tracking
- 📔 Private journal with optional staff sharing
- 🔒 Secure, facility-provided accounts

### For Staff/Admin
- 📢 Create and manage announcements
- 💬 Respond to resident messages
- ✅ Assign chores and review submissions
- 📊 View resident engagement metrics
- 👥 User management (create/deactivate accounts)
- 📜 Audit log access

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: iron-session (secure cookie-based sessions)
- **Styling**: Tailwind CSS
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL)
- Git

## Quick Start

### 1. Clone and Install

```bash
cd mulligan-resident-app
npm install
```

### 2. Start PostgreSQL Database

```bash
docker-compose up -d
```

Verify the database is running:
```bash
docker ps
```

### 3. Environment Setup

The `.env` file should already exist with development defaults:
```
DATABASE_URL="postgresql://mulligan:mulligan_dev_pass@localhost:5432/mulligan_resident_app"
SESSION_SECRET="mulligan-dev-secret-change-in-production-min-32-chars"
UPLOAD_DIR="./uploads"
```

**⚠️ PRODUCTION**: Change `SESSION_SECRET` to a secure random string (min 32 chars)

### 4. Database Setup

Generate Prisma Client:
```bash
npm run db:generate
```

Run migrations:
```bash
npm run db:push
```

Seed the database:
```bash
npm run db:seed
```

### 5. Create Uploads Directory

```bash
mkdir -p uploads
```

### 6. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

After seeding, use these credentials:

| Role | Username | Password | Notes |
|------|----------|----------|-------|
| Admin | `admin` | `Password123!` | Full access |
| Staff | `staff` | `Password123!` | Staff permissions |
| Resident | `jdoe` | `Password123!` | Must change password on first login |
| Resident | `asmith` | `Password123!` | Must change password on first login |

## Project Structure

```
mulligan-resident-app/
├── app/
│   ├── (dashboard)/          # Protected routes with navigation
│   │   ├── announcements/
│   │   ├── chores/
│   │   ├── dashboard/
│   │   ├── journal/
│   │   ├── meetings/
│   │   ├── messages/
│   │   └── admin/
│   ├── api/                  # API routes
│   │   ├── auth/
│   │   ├── announcements/
│   │   ├── chores/
│   │   ├── messages/
│   │   └── ...
│   ├── login/
│   ├── change-password/
│   ├── crisis-resources/
│   ├── globals.css
│   └── layout.tsx
├── components/               # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Navigation.tsx
│   └── EmergencyBanner.tsx
├── lib/                      # Utilities
│   ├── auth.ts              # Auth helpers
│   ├── prisma.ts            # Prisma client
│   └── session.ts           # Session config
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
├── uploads/                 # File uploads (gitignored)
├── .env                     # Environment variables
├── docker-compose.yml       # PostgreSQL container
├── package.json
└── README.md
```

## Database Schema

### Core Models

- **User**: Authentication and role-based access
- **Announcement**: House-wide communications
- **AnnouncementAck**: Acknowledgement tracking
- **MessageThread**: One thread per resident
- **Message**: Direct messages between residents and staff
- **ChoreTemplate**: Reusable chore definitions
- **ChoreAssignment**: Daily chore assignments
- **ChoreSubmission**: Photo proof and review
- **Meeting**: AA/NA meeting directory
- **MeetingPlan**: Resident attendance planning
- **JournalEntry**: Private resident reflections
- **AuditLog**: Action tracking for compliance

### Enums

- **Role**: RESIDENT, STAFF, ADMIN
- **AnnouncementAudience**: ALL, RESIDENTS, STAFF
- **ChoreShift**: AM, PM
- **ChoreStatus**: ASSIGNED, SUBMITTED, APPROVED, NEEDS_REDO
- **MeetingType**: AA, NA, OTHER
- **AttendanceStatus**: PLANNED, ATTENDED, NO_SHOW

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database (dev)
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio (database GUI)
```

## Security Features

### Implemented

✅ Secure cookie-based sessions (httpOnly, sameSite)  
✅ Password hashing with bcrypt (10 rounds)  
✅ Role-based access control (RBAC)  
✅ Forced password change on first login  
✅ Input validation on all forms  
✅ File upload validation (type, size)  
✅ Audit logging for sensitive actions  
✅ No PHI storage  

### Production Checklist

Before deploying to production:

- [ ] Change `SESSION_SECRET` to a cryptographically secure random string (min 32 chars)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/TLS
- [ ] Configure secure database credentials
- [ ] Set up file storage adapter (S3, etc.) for production
- [ ] Implement rate limiting on auth endpoints
- [ ] Configure backup strategy for database
- [ ] Set up monitoring and error tracking
- [ ] Review and configure CORS policies
- [ ] Enable database connection pooling
- [ ] Set up automated backups
- [ ] Configure proper logging

## File Upload Configuration

### Development
- Files stored in `./uploads` directory
-Max size: 10MB (configurable in `next.config.mjs`)
- Allowed types: image/* (jpg, png, webp, gif)

### Production
- Interface designed for S3-compatible storage
- Update `lib/storage.ts` (not yet implemented) with S3 adapter
- Configure AWS credentials in environment variables

## Data Retention

### Configurable Settings (Placeholder)

The app includes placeholders for retention policies:
- Chore photos: Suggested 90 days
- Messages: Suggested 180 days
- Journal entries: Resident-controlled
- Audit logs: 1 year minimum for compliance

**Note**: Retention automation is not implemented in MVP. Implement as needed based on facility policy.

## Crisis Resources

The app includes a prominent emergency banner on all authenticated pages and a dedicated crisis resources page at `/crisis-resources` with:
- Emergency services (911)
- Staff contact placeholders
- National crisis hotlines
- Support resources

## Browser Support

Tested on:
- Chrome/Edge (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# View database logs
docker logs mulligan-postgres

# Restart database
docker-compose restart
```

### Port Already in Use

If port 3000 is in use:
```bash
# Run on different port
PORT=3001 npm run dev
```

### Prisma Issues

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Regenerate Prisma Client
npm run db:generate
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password

### Announcements
- `GET /api/announcements` - List announcements (filtered by role)
- `POST /api/announcements/[id]/acknowledge` - Acknowledge announcement

### Messages
- `GET /api/messages` - Get resident's message thread
- `POST /api/messages` - Send message

### Chores
- `GET /api/chores` - List chore assignments
- `POST /api/chores/[id]/submit` - Submit chore proof
- `POST /api/chores/[id]/review` - Review submission (staff)

### Meetings
- `GET /api/meetings` - List active meetings
- `POST /api/meetings/[id]/plan` - Plan to attend
- `POST /api/meetings/[id]/attend` - Mark attended

### Journal
- `GET /api/journal` - Get journal entries
- `POST /api/journal` - Create entry

## Support

For technical support or questions:
- Check documentation in `/docs` (if added)
- Review audit logs for debugging
- Contact the development team

## License

Proprietary - Mulligan Recovery Centers

---

**Last Updated**: February 2026  
**Version**: 0.1.0 (MVP)
