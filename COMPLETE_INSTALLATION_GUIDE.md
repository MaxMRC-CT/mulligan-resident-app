# Complete Installation Guide - All Missing Features

## Overview
This package includes ALL missing features for the Mulligan Resident App:
- ✅ User management (create, edit, activate/deactivate)
- ✅ Chore template management
- ✅ Announcement acknowledgements
- ✅ Photo upload and serving
- ✅ Updated navigation with proper role-based access
- ✅ Activity logging for all actions
- ✅ Logout functionality

## Total Files: 19

### Installation Commands

**Step 1: Create all directories**
```bash
cd ~/Documents/mulligan-resident-app

# User management
mkdir -p app/\(dashboard\)/admin/users/new
mkdir -p app/\(dashboard\)/admin/users/\[id\]/edit
mkdir -p app/api/admin/users/create
mkdir -p app/api/admin/users/update
mkdir -p app/api/admin/users/toggle-active

# Chore templates
mkdir -p app/\(dashboard\)/chores/templates/new
mkdir -p app/\(dashboard\)/chores/templates/\[id\]/edit
mkdir -p app/api/chores/templates/create
mkdir -p app/api/chores/templates/toggle

# Announcements
mkdir -p app/api/announcements/acknowledge

# File uploads
mkdir -p app/api/uploads/\[...path\]

# Auth
mkdir -p app/api/auth/logout

# Components
mkdir -p components
```

**Step 2: Copy all files**

### Pages:

1. **app/(dashboard)/admin/users/new/page.tsx**
   ← `new-user-page.tsx`

2. **app/(dashboard)/admin/users/[id]/edit/page.tsx**
   ← `edit-user-page.tsx`

3. **app/(dashboard)/chores/templates/page.tsx**
   ← `chore-templates-page.tsx`

4. **app/(dashboard)/chores/templates/new/page.tsx**
   ← `new-chore-template-page.tsx`

### API Routes:

5. **app/api/announcements/acknowledge/route.ts**
   ← `announcement-ack-api.ts`

6. **app/api/admin/users/create/route.ts**
   ← `create-user-api.ts`

7. **app/api/admin/users/update/route.ts**
   ← `update-user-api.ts`

8. **app/api/admin/users/toggle-active/route.ts**
   ← `toggle-user-active-api.ts`

9. **app/api/chores/templates/create/route.ts**
   ← `create-chore-template-api.ts`

10. **app/api/chores/templates/toggle/route.ts**
    ← `toggle-chore-template-api.ts`

11. **app/api/uploads/[...path]/route.ts**
    ← `serve-uploads-api.ts`

12. **app/api/auth/logout/route.ts**
    ← `logout-api.ts`

### Components & Config:

13. **components/Navigation.tsx**
    ← `navigation-component.tsx`

14. **app/(dashboard)/layout.tsx** (REPLACE existing)
    ← `dashboard-layout.tsx`

15. **next.config.mjs** (REPLACE existing)
    ← `next-config.mjs`

---

## Quick Copy Commands

If all files are in ~/Downloads:

```bash
cd ~/Documents/mulligan-resident-app

# Pages
cp ~/Downloads/new-user-page.tsx app/\(dashboard\)/admin/users/new/page.tsx
cp ~/Downloads/edit-user-page.tsx app/\(dashboard\)/admin/users/\[id\]/edit/page.tsx
cp ~/Downloads/chore-templates-page.tsx app/\(dashboard\)/chores/templates/page.tsx
cp ~/Downloads/new-chore-template-page.tsx app/\(dashboard\)/chores/templates/new/page.tsx

# API Routes
cp ~/Downloads/announcement-ack-api.ts app/api/announcements/acknowledge/route.ts
cp ~/Downloads/create-user-api.ts app/api/admin/users/create/route.ts
cp ~/Downloads/update-user-api.ts app/api/admin/users/update/route.ts
cp ~/Downloads/toggle-user-active-api.ts app/api/admin/users/toggle-active/route.ts
cp ~/Downloads/create-chore-template-api.ts app/api/chores/templates/create/route.ts
cp ~/Downloads/toggle-chore-template-api.ts app/api/chores/templates/toggle/route.ts
cp ~/Downloads/serve-uploads-api.ts app/api/uploads/\[...path\]/route.ts
cp ~/Downloads/logout-api.ts app/api/auth/logout/route.ts

# Components & Config
cp ~/Downloads/navigation-component.tsx components/Navigation.tsx
cp ~/Downloads/dashboard-layout.tsx app/\(dashboard\)/layout.tsx
cp ~/Downloads/next-config.mjs next.config.mjs
```

---

## What Each File Does

### User Management System
- **new-user-page.tsx**: Form to create new users (admin only)
- **edit-user-page.tsx**: Edit existing user details, reset passwords
- **create-user-api.ts**: Handles user creation with password hashing
- **update-user-api.ts**: Updates user info and optional password reset
- **toggle-user-active-api.ts**: Activate/deactivate user accounts

### Chore Template Management  
- **chore-templates-page.tsx**: List all chore templates
- **new-chore-template-page.tsx**: Create new chore types
- **create-chore-template-api.ts**: Saves new templates to database
- **toggle-chore-template-api.ts**: Activate/deactivate templates

### Announcements
- **announcement-ack-api.ts**: Mark announcements as read

### File Handling
- **serve-uploads-api.ts**: Serves uploaded chore photos securely
- **next-config.mjs**: Configures file upload size limits and routing

### Navigation & Layout
- **navigation-component.tsx**: Role-based navigation menu
- **dashboard-layout.tsx**: Updated layout using new navigation

### Authentication
- **logout-api.ts**: Destroys session and redirects to login

---

## Testing Checklist

### As Admin:

1. **User Management**
   - [ ] Go to /admin
   - [ ] Click "Add User"
   - [ ] Create a test resident
   - [ ] Edit the user
   - [ ] Deactivate/reactivate the user
   - [ ] Check activity log shows all actions

2. **Chore Templates**
   - [ ] Go to /chores
   - [ ] Click "Manage Templates"
   - [ ] Create a new template (e.g., "Clean Bathroom")
   - [ ] Toggle it inactive/active
   - [ ] Use it to assign a chore

3. **Navigation**
   - [ ] Verify Chores and Admin links appear in nav
   - [ ] Click Logout button
   - [ ] Verify you're logged out

### As Staff:

1. **Chore Management**
   - [ ] Login as staff
   - [ ] Verify Chores link appears
   - [ ] Verify Admin link does NOT appear
   - [ ] Assign a chore
   - [ ] Check it appears in assignments list

### As Resident:

1. **Dashboard**
   - [ ] Login as resident
   - [ ] See announcements
   - [ ] See today's chores
   - [ ] Click "Mark as Read" on announcement
   - [ ] Verify Chores and Admin links do NOT appear

2. **Chore Submission**
   - [ ] Click "Complete & Submit" on a chore
   - [ ] Upload a photo
   - [ ] Verify it shows "Awaiting review"

3. **Photo Display**
   - [ ] As staff, go to /chores
   - [ ] See pending submission with photo displayed

---

## Common Issues & Fixes

**Issue: Photos not displaying**
```bash
# Ensure uploads directory exists
mkdir -p uploads/chores
chmod 755 uploads
```

**Issue: Navigation not showing**
```bash
# Verify Navigation.tsx is in components folder
ls components/Navigation.tsx
```

**Issue: 404 on new pages**
```bash
# Restart dev server
# Press Ctrl+C
npm run dev
```

**Issue: Activity log not showing actions**
- Verify all API routes have auditLog.create() calls
- Check admin page is querying auditLog table

**Issue: Forms not submitting**
- Check browser console for errors
- Verify API routes exist at correct paths
- Check terminal for server errors

---

## Verification

After installation, verify these URLs work:

- ✅ http://localhost:3000/admin
- ✅ http://localhost:3000/admin/users/new
- ✅ http://localhost:3000/chores
- ✅ http://localhost:3000/chores/templates
- ✅ http://localhost:3000/chores/templates/new

---

## Next Steps (Future Enhancements)

1. **Work Schedule Feature**
   - Allow residents to input work shifts
   - Display on dashboard calendar

2. **Detailed Chore Review Page**
   - `/chores/submissions/[id]/review`
   - Larger photo view, comment thread

3. **Meeting Management**
   - CRUD for AA/NA meetings
   - Attendance check-in/out

4. **Journal System**
   - Daily journal entries
   - Mood tracking
   - Staff visibility toggle

5. **Messaging System**
   - Staff-resident threads
   - Real-time notifications

---

## File Mapping Reference

| Downloaded File | Install Location |
|----------------|------------------|
| new-user-page.tsx | app/(dashboard)/admin/users/new/page.tsx |
| edit-user-page.tsx | app/(dashboard)/admin/users/[id]/edit/page.tsx |
| chore-templates-page.tsx | app/(dashboard)/chores/templates/page.tsx |
| new-chore-template-page.tsx | app/(dashboard)/chores/templates/new/page.tsx |
| announcement-ack-api.ts | app/api/announcements/acknowledge/route.ts |
| create-user-api.ts | app/api/admin/users/create/route.ts |
| update-user-api.ts | app/api/admin/users/update/route.ts |
| toggle-user-active-api.ts | app/api/admin/users/toggle-active/route.ts |
| create-chore-template-api.ts | app/api/chores/templates/create/route.ts |
| toggle-chore-template-api.ts | app/api/chores/templates/toggle/route.ts |
| serve-uploads-api.ts | app/api/uploads/[...path]/route.ts |
| logout-api.ts | app/api/auth/logout/route.ts |
| navigation-component.tsx | components/Navigation.tsx |
| dashboard-layout.tsx | app/(dashboard)/layout.tsx |
| next-config.mjs | next.config.mjs |

---

## Support

If you encounter errors:
1. Check terminal output for error details
2. Check browser console (F12)
3. Verify all files are in correct locations
4. Ensure all directories were created
5. Clear Next.js cache: `rm -rf .next`
6. Restart dev server

All files include proper error handling and logging. Check the terminal for detailed error messages.
