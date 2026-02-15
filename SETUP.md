# Mulligan Resident App - Setup Commands

## Complete Setup from Scratch

This document provides exact commands to set up and run the Mulligan Resident App.

---

## Prerequisites Installation

### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Verify installations
node --version  # Should be 18+
npm --version
docker --version
docker-compose --version
```

### Ubuntu/Debian Linux
```bash
# Update package list
sudo apt update

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Add user to docker group (logout/login required)
sudo usermod -aG docker $USER

# Verify installations
node --version
npm --version
docker --version
docker-compose --version
```

### Windows
```powershell
# Install Node.js from https://nodejs.org/
# Install Docker Desktop from https://www.docker.com/products/docker-desktop

# Verify in PowerShell
node --version
npm --version
docker --version
docker-compose --version
```

---

## Project Setup

### Step 1: Navigate to Project Directory

```bash
cd /path/to/mulligan-resident-app
```

### Step 2: Install Node Dependencies

```bash
npm install
```

Expected output:
```
added XXX packages, and audited XXX packages in XXs
```

### Step 3: Start PostgreSQL Database

```bash
# Start database in background
docker-compose up -d

# Verify it's running
docker ps
```

You should see:
```
CONTAINER ID   IMAGE              STATUS         PORTS                    NAMES
xxxxx          postgres:16-alpine Up 2 seconds   0.0.0.0:5432->5432/tcp   mulligan-postgres
```

### Step 4: Verify Environment Variables

The `.env` file should already exist with these settings:
```bash
cat .env
```

Should show:
```
DATABASE_URL="postgresql://mulligan:mulligan_dev_pass@localhost:5432/mulligan_resident_app"
SESSION_SECRET="mulligan-dev-secret-change-in-production-min-32-chars"
UPLOAD_DIR="./uploads"
```

### Step 5: Generate Prisma Client

```bash
npm run db:generate
```

Expected output:
```
✔ Generated Prisma Client
```

### Step 6: Push Schema to Database

```bash
npm run db:push
```

Expected output:
```
🚀  Your database is now in sync with your Prisma schema.
```

### Step 7: Create Uploads Directory

```bash
mkdir -p uploads
```

### Step 8: Seed Database

```bash
npm run db:seed
```

Expected output:
```
🌱 Starting seed...
✓ Cleared existing data
✓ Created users (admin, staff, jdoe, asmith)
  → Default password for all: Password123!
✓ Created 3 announcements
✓ Created message threads and sample messages
✓ Created 3 chore templates
✓ Created chore assignments
✓ Created 4 meetings
✓ Created sample journal entries
✓ Created audit logs

✅ Seed completed successfully!

📋 Login credentials:
   Admin:     username: admin    | password: Password123!
   Staff:     username: staff    | password: Password123!
   Resident:  username: jdoe     | password: Password123!
   Resident:  username: asmith   | password: Password123!

⚠️  Residents will be prompted to change password on first login
```

### Step 9: Start Development Server

```bash
npm run dev
```

Expected output:
```
   ▲ Next.js 14.2.18
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in XXXXms
```

### Step 10: Access the Application

Open your browser to: **http://localhost:3000**

You will be redirected to the login page.

---

## Testing the Application

### Test 1: Login as Admin

1. Go to http://localhost:3000
2. Enter:
   - Username: `admin`
   - Password: `Password123!`
3. Click "Sign In"
4. You should see the dashboard

### Test 2: Login as Resident (Password Change Flow)

1. Logout (click Logout in top right)
2. Login with:
   - Username: `jdoe`
   - Password: `Password123!`
3. You will be prompted to change password
4. Enter:
   - Current Password: `Password123!`
   - New Password: `NewPassword123!`
   - Confirm: `NewPassword123!`
5. You should be redirected to dashboard

### Test 3: View Announcements

1. Click "Announcements" in navigation
2. You should see 3 sample announcements
3. Click "Acknowledge" on one
4. It should show "✓ Acknowledged"

---

## Database Management Commands

### View Database in GUI

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
```

### View Database Logs

```bash
docker logs mulligan-postgres
```

### Connect to Database CLI

```bash
docker exec -it mulligan-postgres psql -U mulligan -d mulligan_resident_app
```

Inside psql:
```sql
\dt          -- List tables
\d users     -- Describe users table
SELECT * FROM "User" LIMIT 5;
\q           -- Quit
```

---

## Development Workflow Commands

### Start Development

```bash
# Terminal 1: Database (if not already running)
docker-compose up

# Terminal 2: Development server
npm run dev
```

### Stop Development

```bash
# Stop dev server: Ctrl+C

# Stop database
docker-compose down
```

### View Logs

```bash
# Application logs: View in terminal running `npm run dev`

# Database logs
docker logs -f mulligan-postgres

# Database without following
docker logs mulligan-postgres | tail -100
```

---

## Common Tasks

### Add a New User via Database

```bash
# Open Prisma Studio
npm run db:studio

# Navigate to User model
# Click "Add record"
# Fill in fields (passwordHash must be bcrypt hashed)
```

### Change Database Password

1. Edit `.env`:
```bash
DATABASE_URL="postgresql://mulligan:NEW_PASSWORD@localhost:5432/mulligan_resident_app"
```

2. Edit `docker-compose.yml`:
```yaml
POSTGRES_PASSWORD: NEW_PASSWORD
```

3. Restart:
```bash
docker-compose down
docker-compose up -d
npm run db:push
```

### Clear All Data and Reseed

```bash
npm run db:seed
```

The seed script clears existing data before seeding.

---

## Troubleshooting Commands

### Database Won't Start

```bash
# Check if port 5432 is in use
lsof -i :5432

# Kill process using port (if needed)
kill -9 <PID>

# Remove old containers
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Can't Connect to Database

```bash
# Check database is running
docker ps | grep postgres

# Check database logs
docker logs mulligan-postgres

# Test connection
docker exec -it mulligan-postgres psql -U mulligan -d mulligan_resident_app -c "SELECT 1;"
```

### Port 3000 Already in Use

```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Run on different port
PORT=3001 npm run dev
```

### Prisma Generation Errors

```bash
# Clear Prisma cache
rm -rf node_modules/.prisma

# Reinstall
npm install

# Regenerate
npm run db:generate
```

### Module Not Found Errors

```bash
# Clear all caches and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

---

## Production Deployment Commands

⚠️ **Do not use these commands for production without proper configuration**

### Build for Production

```bash
# Install production dependencies only
npm ci --production

# Build
npm run build

# Start production server
npm start
```

### Environment Setup for Production

```bash
# Generate secure session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env with production values
# Never commit .env to git!
```

---

## Clean Up Commands

### Stop Everything

```bash
# Stop dev server (Ctrl+C in terminal)

# Stop and remove database
docker-compose down

# Remove database volumes (⚠️ deletes all data)
docker-compose down -v
```

### Complete Clean Slate

```bash
# Remove all build artifacts and dependencies
rm -rf node_modules .next dist build uploads
rm -f package-lock.json

# Remove database
docker-compose down -v

# Reinstall
npm install
```

---

## Useful Shortcuts

### Quick Start (After Initial Setup)

```bash
# One-liner to start everything
docker-compose up -d && npm run dev
```

### Quick Stop

```bash
# Stop dev server: Ctrl+C
# Stop database
docker-compose down
```

### Quick Reset Data

```bash
npm run db:seed
```

---

## Health Check Commands

### Check Application Health

```bash
# Test if server is running
curl http://localhost:3000

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Password123!"}'
```

### Check Database Health

```bash
# Test connection
docker exec mulligan-postgres pg_isready -U mulligan

# Check database size
docker exec mulligan-postgres psql -U mulligan -d mulligan_resident_app -c "
SELECT pg_size_pretty(pg_database_size('mulligan_resident_app'));"
```

---

## Additional Tools

### Database Backup

```bash
# Create backup
docker exec mulligan-postgres pg_dump -U mulligan mulligan_resident_app > backup.sql

# Restore backup
docker exec -i mulligan-postgres psql -U mulligan mulligan_resident_app < backup.sql
```

### View All NPM Scripts

```bash
npm run
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all (⚠️ test thoroughly after)
npm update

# Update specific package
npm update <package-name>
```

---

## Summary: Quick Reference

```bash
# Initial setup (run once)
npm install
docker-compose up -d
npm run db:generate
npm run db:push
mkdir -p uploads
npm run db:seed

# Daily development
docker-compose up -d  # Start DB
npm run dev          # Start app

# Reset data
npm run db:seed

# Stop
# Ctrl+C (stop dev server)
docker-compose down  # Stop DB

# Database GUI
npm run db:studio
```

---

**Last Updated**: February 15, 2026
