# Mulligan Resident App - Implementation Plan

## Project Overview

**Goal**: Build a shippable MVP of a mobile-first resident portal for Mulligan Recovery Centers that handles announcements, messaging, chores, meetings, and journaling - with ZERO PHI storage.

**Timeline**: 4 weeks to MVP  
**Team**: 1 Senior Full-Stack Engineer  
**Deployment**: Web-based PWA (mobile-first)

---

## Phase 1: Foundation (Week 1)

### Goals
- Set up development environment
- Implement authentication and authorization
- Create core UI components and layouts

### Milestones

#### 1.1 Project Setup (Days 1-2)
- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS with Mulligan brand colors
- [x] Set up PostgreSQL with Docker
- [x] Configure Prisma ORM
- [x] Create database schema (all models and enums)
- [x] Set up environment variables and secrets

#### 1.2 Authentication System (Days 3-4)
- [x] Implement iron-session for cookie-based auth
- [x] Create login page and API route
- [x] Implement password hashing with bcrypt
- [x] Build force password change flow
- [x] Create auth utility functions (requireAuth, requireRole)
- [x] Add session management helpers

#### 1.3 Core UI & Navigation (Days 4-5)
- [x] Build reusable components (Button, Card, Input, Textarea)
- [x] Create navigation component with role-based menu
- [x] Implement emergency banner
- [x] Design dashboard layout
- [x] Create crisis resources page
- [x] Set up mobile-responsive breakpoints

**Deliverable**: Working login system with role-based navigation

---

## Phase 2: Core Modules (Week 2)

### Goals
- Implement announcements, messaging, and chores modules
- Enable basic resident and staff workflows

### Milestones

#### 2.1 Announcements Module (Days 6-7)
- [x] Create announcements list page
- [x] Implement announcement API routes
- [x] Build acknowledgement functionality
- [ ] Add staff CRUD interface for announcements
- [ ] Implement pinning and audience filtering
- [ ] Create announcement detail view

#### 2.2 Messaging Module (Days 8-9)
- [ ] Build message thread list (staff view)
- [ ] Create message conversation interface
- [ ] Implement send message API
- [ ] Add messaging disabled check
- [ ] Build staff message response interface
- [ ] Add real-time message indicators (optional)

#### 2.3 Chores Module (Days 9-10)
- [ ] Create chore assignment list (resident view)
- [ ] Build photo upload interface
- [ ] Implement file upload API with validation
- [ ] Create chore submission API
- [ ] Build staff review interface
- [ ] Add status filters and search

**Deliverable**: Residents can acknowledge announcements, message staff, and submit chore proofs

---

## Phase 3: Meetings & Journal (Week 3)

### Goals
- Complete meetings planner and journal modules
- Implement file storage system

### Milestones

#### 3.1 Meetings Module (Days 11-12)
- [ ] Create meetings list page
- [ ] Build meeting detail cards
- [ ] Implement "plan to attend" functionality
- [ ] Add attendance check-in interface
- [ ] Create staff meeting management (CRUD)
- [ ] Build engagement dashboard for staff

#### 3.2 Journal Module (Days 13-14)
- [ ] Create journal entry list (resident view)
- [ ] Build new entry form with mood selector
- [ ] Implement share-with-staff toggle
- [ ] Add journal entry API routes
- [ ] Create staff view for shared entries only
- [ ] Add entry filtering and search

#### 3.3 File Storage (Day 14)
- [x] Set up local file storage for uploads
- [ ] Implement photo upload validation
- [ ] Create storage adapter interface
- [ ] Add file serving route
- [ ] Document S3 migration path

**Deliverable**: Complete resident workflow (announcements → chores → meetings → journal)

---

## Phase 4: Admin & Polish (Week 4)

### Goals
- Build admin console
- Add audit logging
- Polish UI and fix bugs

### Milestones

#### 4.1 Admin Console (Days 15-17)
- [ ] Create user management interface
- [ ] Implement create user API
- [ ] Build password reset functionality
- [ ] Add activate/deactivate users
- [ ] Create messaging toggle interface
- [ ] Implement audit log viewer
- [ ] Add basic stats dashboard

#### 4.2 Audit Logging (Day 17)
- [ ] Log user creation/updates
- [ ] Log announcement CRUD operations
- [ ] Log chore approvals/rejections
- [ ] Log password resets
- [ ] Log messaging status changes
- [ ] Create audit log API routes

#### 4.3 Testing & Polish (Days 18-19)
- [ ] Manual testing of all user flows
- [ ] Fix bugs and edge cases
- [ ] Improve mobile responsiveness
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add form validation feedback
- [ ] Test on multiple devices/browsers

#### 4.4 Documentation & Deployment Prep (Day 20)
- [x] Write comprehensive README
- [x] Document API endpoints
- [x] Create setup instructions
- [ ] Write security checklist
- [ ] Document production deployment steps
- [ ] Create environment variable guide
- [ ] Add troubleshooting guide

**Deliverable**: Production-ready MVP

---

## Post-MVP Enhancements (Backlog)

### Priority 1 (Next Sprint)
- Push notifications (PWA)
- Email notifications for announcements
- Advanced chore filtering and calendar view
- Group messaging channels (with moderation)
- Meeting attendance approval flow
- Enhanced admin reporting

### Priority 2 (Future)
- Mobile app wrappers (React Native)
- Offline support
- Photo compression/optimization
- S3 file storage implementation
- Advanced audit log filtering
- Export capabilities (PDF reports)
- Integration with external calendar systems

### Priority 3 (Long-term)
- Video messages
- Multilingual support
- Custom branding per facility
- Analytics dashboard
- API for third-party integrations

---

## Risk Mitigation

### Technical Risks

| Risk | Mitigation |
|------|------------|
| File upload security | Validate file types, size limits, sanitize filenames, isolated storage |
| Session hijacking | HttpOnly cookies, SameSite, secure in production, session timeout |
| Data breach | No PHI storage, regular security audits, encrypted DB connections |
| Performance issues | Pagination, lazy loading, database indexing, connection pooling |

### Product Risks

| Risk | Mitigation |
|------|------------|
| Low adoption | Staff training, simple onboarding, crisis resources prominent |
| Messaging abuse | Moderation tools, disable capability, audit logs |
| Chore non-compliance | Clear instructions, photo requirements, staff review process |

---

## Success Metrics

### Technical Metrics
- [ ] 100% of core user flows functional
- [ ] <2s page load time
- [ ] Zero critical security vulnerabilities
- [ ] Mobile responsive on all target devices
- [ ] 99% uptime during pilot

### Product Metrics (30-60 days post-launch)
- [ ] ≥80% residents acknowledge announcements within 24 hours
- [ ] ≥70% chore completion rate with photo proof
- [ ] <24 hour staff response time to messages
- [ ] ≥50% journal engagement (entries per week)
- [ ] Qualitative feedback from staff (reduced manual tracking time)

---

## Current Status

### Completed ✅
- Project setup and configuration
- Database schema design
- Authentication system
- Session management
- Core UI components
- Navigation and layouts
- Login/password change flows
- Dashboard pages
- Announcements list (frontend)
- Emergency banner and crisis resources

### In Progress 🚧
- Announcements CRUD (staff interface)
- File upload system
- Remaining module implementations

### Not Started ⏸️
- Messaging module
- Chores module (except schema)
- Meetings module (except schema)
- Journal module (except schema)
- Admin console
- Audit logging implementation

---

## Notes

- This is a non-PHI system - no medical, clinical, or diagnosis data
- Security is paramount - all actions are logged and auditable
- Mobile-first design - most users will access via phone
- Simple > feature-rich for MVP - ship fast, iterate based on feedback
- Staff buy-in is critical - focus on reducing their workload, not adding to it

**Last Updated**: February 15, 2026
