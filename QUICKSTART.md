# 🚀 Quick Start Guide - Mulligan Resident App

## ⚡ 5-Minute Setup

### Prerequisites Check
```bash
node --version    # Need 18+
npm --version
docker --version
```

If any are missing, see SETUP.md for installation instructions.

---

## Step-by-Step (Copy & Paste)

### 1️⃣ Install Dependencies
```bash
cd mulligan-resident-app
npm install
```
Wait for: `added XXX packages`

### 2️⃣ Start Database
```bash
docker-compose up -d
```
Verify with: `docker ps` (should see `mulligan-postgres`)

### 3️⃣ Setup Database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

You should see:
```
✅ Seed completed successfully!

📋 Login credentials:
   Admin:     username: admin    | password: Password123!
   Staff:     username: staff    | password: Password123!
   Resident:  username: jdoe     | password: Password123!
   Resident:  username: asmith   | password: Password123!
```

### 4️⃣ Create Uploads Folder
```bash
mkdir -p uploads
```

### 5️⃣ Start Server
```bash
npm run dev
```

Wait for: `✓ Ready in XXXXms`

### 6️⃣ Open Browser
```
http://localhost:3000
```

---

## ✨ First Login

1. You'll see the login page
2. Use these credentials:
   - Username: `admin`
   - Password: `Password123!`
3. Click "Sign In"
4. You should see the dashboard!

---

## 🧪 Test the Features

### Announcements
1. Click "Announcements" in navigation
2. See 3 sample announcements
3. Click "Acknowledge" on one
4. It should show "✓ Acknowledged"

### Crisis Resources
1. Click "View crisis resources" in the emergency banner
2. See emergency hotlines and resources

### Change Password (as Resident)
1. Logout (top right)
2. Login as: `jdoe` / `Password123!`
3. You'll be prompted to change password
4. Enter new password
5. You'll see the dashboard

---

## 📊 View Database

Want to see the data?
```bash
npm run db:studio
```
Opens at: http://localhost:5555

---

## 🛑 Stop Everything

```bash
# Stop dev server
# Press Ctrl+C in terminal

# Stop database
docker-compose down
```

---

## 🔄 Daily Development

### Start
```bash
docker-compose up -d
npm run dev
```

### Stop
```bash
# Ctrl+C (dev server)
docker-compose down
```

---

## 🆘 Troubleshooting

### Database won't start?
```bash
docker-compose down -v
docker-compose up -d
```

### Port 3000 in use?
```bash
PORT=3001 npm run dev
```

### Need to reset data?
```bash
npm run db:seed
```

### Something broken?
```bash
rm -rf node_modules .next
npm install
npm run dev
```

---

## 📱 What Works Right Now

✅ Login / Logout  
✅ Password change  
✅ Dashboard (role-based)  
✅ Announcements (view and acknowledge)  
✅ Crisis resources  
✅ Role-based navigation  
✅ Emergency banner  

## 🚧 What's Next to Build

⏸️ Messages module  
⏸️ Chores with photo upload  
⏸️ Meetings planner  
⏸️ Journal entries  
⏸️ Admin console  

---

## 📚 Need More Help?

- **Setup details**: See `SETUP.md`
- **Full documentation**: See `README.md`
- **Project roadmap**: See `PROJECT_PLAN.md`
- **Security info**: See `SECURITY.md`
- **File structure**: See `FILE_STRUCTURE.md`

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run db:studio        # Open database GUI

# Database
npm run db:seed          # Reset data
npm run db:push          # Update schema
docker-compose up -d     # Start PostgreSQL
docker-compose down      # Stop PostgreSQL

# Production
npm run build            # Build for production
npm start                # Start production server
```

---

## ✅ Success Checklist

After setup, you should be able to:
- [ ] Login as admin
- [ ] See the dashboard
- [ ] View announcements
- [ ] Acknowledge an announcement
- [ ] View crisis resources
- [ ] Login as jdoe (forced password change)
- [ ] Navigate between pages
- [ ] Logout

If all checked, you're ready to develop! 🎉

---

**Need help?** Check the documentation files or review the code in `/app` and `/components`

**Ready to build?** Start with implementing the Messages module - see `PROJECT_PLAN.md` for guidance
