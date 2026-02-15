# Mulligan Resident App - File Structure

```
mulligan-resident-app/
│
├── 📄 Configuration Files
│   ├── .env                          # Environment variables (DATABASE_URL, SESSION_SECRET)
│   ├── .env.example                  # Template for environment setup
│   ├── .gitignore                    # Git ignore rules
│   ├── docker-compose.yml            # PostgreSQL container config
│   ├── next.config.mjs               # Next.js configuration
│   ├── package.json                  # Dependencies and scripts
│   ├── postcss.config.js             # PostCSS plugins
│   ├── tailwind.config.ts            # Tailwind + Mulligan brand colors
│   └── tsconfig.json                 # TypeScript configuration
│
├── 📚 Documentation
│   ├── README.md                     # Main documentation and setup guide
│   ├── SETUP.md                      # Detailed setup commands
│   ├── PROJECT_PLAN.md               # Implementation roadmap
│   └── SECURITY.md                   # Security checklist and guidelines
│
├── 🗄️  Database (prisma/)
│   ├── schema.prisma                 # Complete database schema
│   │                                 # - All models (User, Announcement, Message, etc.)
│   │                                 # - Enums (Role, ChoreStatus, MeetingType, etc.)
│   │                                 # - Relations and indexes
│   └── seed.ts                       # Database seed script
│                                     # Creates: admin, staff, 2 residents
│                                     # Sample data for all modules
│
├── 🔧 Library / Utilities (lib/)
│   ├── auth.ts                       # Auth helpers
│   │                                 # - requireAuth()
│   │                                 # - requireRole()
│   │                                 # - getCurrentUser()
│   ├── prisma.ts                     # Prisma client singleton
│   └── session.ts                    # Session configuration
│                                     # - iron-session setup
│                                     # - SessionData interface
│
├── 🎨 Components (components/)
│   ├── Button.tsx                    # Reusable button (variants: primary, secondary, danger, ghost)
│   ├── Card.tsx                      # Card container component
│   ├── EmergencyBanner.tsx           # Red banner: "Not for emergencies"
│   ├── Input.tsx                     # Form input with label and error
│   ├── Navigation.tsx                # Top navigation (role-based menu)
│   └── Textarea.tsx                  # Textarea with label and error
│
├── 🚀 Application (app/)
│   │
│   ├── 📱 Public Pages
│   │   ├── page.tsx                  # Root redirect to /login
│   │   ├── layout.tsx                # Root layout with globals.css
│   │   ├── globals.css               # Tailwind imports + custom styles
│   │   ├── login/
│   │   │   └── page.tsx              # Login form
│   │   ├── change-password/
│   │   │   └── page.tsx              # Force password change page
│   │   └── crisis-resources/
│   │       └── page.tsx              # Emergency resources and hotlines
│   │
│   ├── 🔐 Protected Routes ((dashboard)/)
│   │   │
│   │   ├── layout.tsx                # Dashboard layout
│   │   │                             # - Includes EmergencyBanner
│   │   │                             # - Includes Navigation
│   │   │                             # - Requires authentication
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Main dashboard
│   │   │                             # - Welcome message
│   │   │                             # - Quick stats (role-based)
│   │   │                             # - Quick actions
│   │   │                             # - Important reminders
│   │   │
│   │   ├── announcements/
│   │   │   └── page.tsx              # Announcements list
│   │   │                             # - View all announcements
│   │   │                             # - Acknowledge functionality
│   │   │                             # - Pinned items highlighted
│   │   │
│   │   ├── messages/                 # [To be implemented]
│   │   │   └── page.tsx              # Messaging interface
│   │   │
│   │   ├── chores/                   # [To be implemented]
│   │   │   └── page.tsx              # Chores list and submission
│   │   │
│   │   ├── meetings/                 # [To be implemented]
│   │   │   └── page.tsx              # Meetings planner
│   │   │
│   │   ├── journal/                  # [To be implemented]
│   │   │   └── page.tsx              # Journal entries
│   │   │
│   │   └── admin/                    # [To be implemented]
│   │       └── page.tsx              # Admin console
│   │
│   └── 🔌 API Routes (api/)
│       │
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts          # POST /api/auth/login
│       │   │                         # - Validates credentials
│       │   │                         # - Creates session
│       │   │                         # - Returns user data
│       │   │
│       │   ├── logout/
│       │   │   └── route.ts          # POST /api/auth/logout
│       │   │                         # - Destroys session
│       │   │
│       │   └── change-password/
│       │       └── route.ts          # POST /api/auth/change-password
│       │                             # - Validates current password
│       │                             # - Hashes new password
│       │                             # - Updates mustChangePassword flag
│       │
│       └── announcements/
│           ├── route.ts              # GET /api/announcements
│           │                         # - Lists announcements (filtered by role)
│           │                         # - Includes acknowledgement status
│           │
│           └── [id]/
│               └── acknowledge/
│                   └── route.ts      # POST /api/announcements/:id/acknowledge
│                                     # - Creates acknowledgement record
│                                     # - Idempotent (no duplicates)
│
└── 📦 Uploads Directory (uploads/)
    └── [gitignored]                  # Chore proof photos stored here
                                      # Created automatically on first upload

```

## Module Status

### ✅ Fully Implemented
- Project setup and configuration
- Database schema (all models)
- Authentication system
- Session management
- Core UI components
- Navigation (role-based)
- Dashboard page
- Announcements (list and acknowledge)
- Crisis resources page
- Login / password change flows

### 🚧 Partially Implemented
- Announcements (staff CRUD interface pending)

### ⏸️  Not Yet Implemented
- Messages module
- Chores module
- Meetings module
- Journal module
- Admin console
- File upload system
- Audit logging (schema exists, implementation pending)

## Key Files to Review

### Configuration
1. **prisma/schema.prisma** - Complete database design
2. **.env** - Environment configuration
3. **tailwind.config.ts** - Mulligan brand colors

### Core Logic
1. **lib/auth.ts** - Authentication and authorization
2. **lib/session.ts** - Session configuration
3. **prisma/seed.ts** - Sample data generator

### API Examples
1. **app/api/auth/login/route.ts** - Login endpoint
2. **app/api/announcements/route.ts** - List announcements (RBAC example)

### UI Examples
1. **app/(dashboard)/dashboard/page.tsx** - Main dashboard
2. **components/Navigation.tsx** - Role-based navigation
3. **app/login/page.tsx** - Form handling example

## Database Tables (Prisma Schema)

### Users & Auth
- **User** - Authentication, roles, display names
- **AuditLog** - Action tracking

### Communication
- **Announcement** - House-wide announcements
- **AnnouncementAck** - Acknowledgement tracking
- **MessageThread** - One per resident
- **Message** - Individual messages

### Chores
- **ChoreTemplate** - Reusable chore definitions
- **ChoreAssignment** - Daily assignments
- **ChoreSubmission** - Photo proof + staff review

### Meetings
- **Meeting** - AA/NA meeting directory
- **MeetingPlan** - Attendance planning

### Personal
- **JournalEntry** - Private reflections

## Routes Map

```
Public Routes:
  GET  /                                    → Redirect to /login
  GET  /login                               → Login page
  GET  /change-password                     → Password change (authenticated)
  GET  /crisis-resources                    → Emergency resources

Protected Routes (require authentication):
  GET  /dashboard                           → Main dashboard
  GET  /announcements                       → Announcements list
  GET  /messages                            → [To implement]
  GET  /chores                              → [To implement]
  GET  /meetings                            → [To implement]
  GET  /journal                             → [To implement] (RESIDENT only)
  GET  /admin                               → [To implement] (STAFF/ADMIN only)

API Routes:
  POST /api/auth/login                      → User login
  POST /api/auth/logout                     → User logout
  POST /api/auth/change-password            → Change password
  
  GET  /api/announcements                   → List announcements
  POST /api/announcements/:id/acknowledge   → Acknowledge announcement
  
  [More to implement...]
```

## NPM Scripts

```json
{
  "dev": "Start Next.js dev server",
  "build": "Build for production",
  "start": "Start production server",
  "lint": "Run ESLint",
  
  "db:generate": "Generate Prisma Client",
  "db:push": "Push schema to database",
  "db:migrate": "Run migrations",
  "db:seed": "Seed database with sample data",
  "db:studio": "Open Prisma Studio GUI"
}
```

## Brand Colors (Tailwind)

```typescript
colors: {
  mulligan: {
    orange: '#F97316',        // Primary CTA color
    black: '#000000',         // Primary text
    white: '#FFFFFF',         // Backgrounds
    'warm-gray': '#2A2A2A',   // Secondary text
    'soft-gray': '#E5E7EB',   // Hover states
  }
}
```

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Start database
docker-compose up -d

# 3. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 4. Create uploads folder
mkdir -p uploads

# 5. Start dev server
npm run dev

# 6. Open browser
# http://localhost:3000
# Login: admin / Password123!
```

---

**Last Updated**: February 15, 2026
