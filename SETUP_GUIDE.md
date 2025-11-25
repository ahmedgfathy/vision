# Vision CRM - Complete Setup Guide

This guide covers the complete setup of Vision CRM with RBAC system from a fresh clone.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MySQL/MariaDB** (v8 or higher / MariaDB 10+)
- **Git**
- **npm** (comes with Node.js)

## 🚀 Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd vision
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Environment

```bash
# Copy and edit backend environment file
cd backend
cp .env.example .env  # If example exists, otherwise create new
```

Edit `backend/.env`:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=vision_crm
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_secret_change_this
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 4. Setup Database

**Option A: Restore from dump (Recommended)**
```bash
cd database
./restore-db.sh
```

**Option B: Setup from scratch**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE vision_crm;"

# Run RBAC setup
cd backend
npm run setup-rbac
```

### 5. Start the Application

```bash
# Terminal 1 - Backend (from backend/ directory)
npm run dev

# Terminal 2 - Frontend (from root directory)
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 📦 Detailed Setup Steps

### Step 1: Database Setup

#### Create MySQL Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE vision_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

#### Restore Database

```bash
cd database
chmod +x restore-db.sh
./restore-db.sh
```

This will:
- Create the database if not exists
- Import all tables and data
- Setup RBAC tables (profiles, profile_modules, profile_fields)
- Import default profiles

### Step 2: Verify Database

```bash
mysql -u root -p vision_crm

-- Check tables
SHOW TABLES;

-- Check profiles
SELECT * FROM profiles;

-- Check users
SELECT id, username, email, role_id, profile_id FROM users;
```

Expected tables:
- `users`, `roles`, `permissions`
- `properties`, `areas`, `types`, `owners`
- `leads`, `agents`, `companies`, `tasks`
- `profiles`, `profile_modules`, `profile_fields` (RBAC)
- `dropdown_types`, `dropdown_items`
- `audit_logs`

### Step 3: Backend Configuration

#### Environment Variables

Create `backend/.env`:
```env
# Server
PORT=3000

# Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=zerocall
DB_NAME=vision_crm

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRES_IN=7d
```

#### Install Backend Dependencies

```bash
cd backend
npm install
```

Key dependencies:
- express
- mysql2
- jsonwebtoken
- bcryptjs
- dotenv
- cors
- multer

### Step 4: Frontend Configuration

#### Install Frontend Dependencies

```bash
cd /path/to/vision  # project root
npm install
```

Key dependencies:
- Vue 3
- Vite
- Pinia (state management)
- Vue Router
- Vue-i18n (internationalization)
- Axios
- Tailwind CSS
- Lucide Vue (icons)

#### Configure API Base URL

Check `src/api/axios.js`:
```javascript
const instance = axios.create({
  baseURL: 'http://localhost:3000/api'
});
```

### Step 5: RBAC System Setup

If you didn't restore from dump, setup RBAC manually:

```bash
cd backend

# Run migration
npm run migrate

# Seed default profiles
npm run seed-profiles

# Or run both
npm run setup-rbac
```

This creates:
1. **Admin Profile** - Full access
2. **Sales Profile** - View only
3. **Agent Profile** - Edit properties, manage leads

### Step 6: Assign Profiles to Users

```bash
mysql -u root -p vision_crm
```

```sql
-- Assign Admin profile to admin user
UPDATE users SET profile_id = 1 WHERE email = 'admin@vision.com';

-- Assign Sales profile
UPDATE users SET profile_id = 2 WHERE email = 'sales@vision.com';

-- Assign Agent profile
UPDATE users SET profile_id = 3 WHERE email = 'agent@vision.com';

-- Verify
SELECT id, email, role_id, profile_id FROM users;
```

### Step 7: Start Development Servers

#### Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
Database connected successfully
Server is running on port 3000
```

#### Frontend Server

```bash
cd /path/to/vision  # project root
npm run dev
```

Expected output:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🧪 Testing the Setup

### 1. Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Get profiles (requires authentication)
curl http://localhost:3000/api/profiles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Test Frontend

1. Open http://localhost:5173
2. Login with your credentials
3. Check sidebar visibility based on profile
4. Test CRUD operations on properties
5. Navigate to Profiles & Permissions (admin only)

### 3. Test RBAC System

#### As Admin
- Access all modules ✅
- Create/Edit/Delete everything ✅
- Access Profile Management ✅

#### As Sales
- View properties and leads ✅
- Cannot edit or create ❌
- Cannot access admin panels ❌

#### As Agent
- Create/Edit properties ✅
- View leads and tasks ✅
- Cannot see price field (hidden) ❌
- Cannot edit owner mobile (read-only) ❌

## 🔧 Common Issues & Solutions

### Issue: "Access denied for user 'root'@'localhost'"

**Solution**: Check database credentials in `backend/.env`
```bash
# Test connection
mysql -u root -p -h 127.0.0.1
```

### Issue: "Unknown column 'role' in 'users'"

**Solution**: The migration expects `role_id` column. Fixed in latest migration.

### Issue: "Cannot find module 'dotenv'"

**Solution**: Install backend dependencies
```bash
cd backend
npm install
```

### Issue: Frontend shows blank page

**Solution**: Check console for errors
```bash
# Rebuild frontend
npm run build
npm run dev
```

### Issue: CORS errors

**Solution**: Check backend CORS configuration in `server.js`
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: RBAC tables not found

**Solution**: Run migration
```bash
cd backend
npm run migrate
npm run seed-profiles
```

## 📊 Database Backup & Restore

### Create Backup

```bash
cd database
./create-dump.sh
```

### Restore Backup

```bash
cd database
./restore-db.sh
```

### Manual Backup

```bash
mysqldump -u root -p vision_crm > backup_$(date +%Y%m%d).sql
```

### Manual Restore

```bash
mysql -u root -p vision_crm < backup_20251125.sql
```

## 🔐 Security Checklist

- [ ] Change default JWT secrets in `.env`
- [ ] Use strong database passwords
- [ ] Never commit `.env` files to git
- [ ] Update admin user passwords
- [ ] Review profile permissions
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Review audit logs regularly

## 📝 Development Workflow

### Daily Development

```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
npm run dev

# Watch for changes - both auto-reload
```

### Adding New Features

1. **Backend**: Add routes/controllers/services
2. **Frontend**: Add components/views/stores
3. **RBAC**: Update `permissionService.js` if new module
4. **i18n**: Add translations to `en.json` & `ar.json`
5. **Test**: Verify with different profiles

### Database Changes

```bash
# After schema changes, update dump
cd database
./create-dump.sh

# Commit the new dump
git add vision_crm_dump.sql
git commit -m "Update database schema"
```

## 🚀 Production Deployment

### 1. Environment Setup

```env
# Production .env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
DB_USER=production_user
DB_PASS=strong_production_password
DB_NAME=vision_crm_prod
JWT_SECRET=very_long_random_secret
```

### 2. Build Frontend

```bash
npm run build
# Serve dist/ folder with nginx or similar
```

### 3. Start Backend

```bash
cd backend
npm start  # Uses production mode
```

### 4. Use Process Manager

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name vision-backend

# Start on boot
pm2 startup
pm2 save
```

## 📚 Additional Resources

- [RBAC Documentation](./RBAC_DOCUMENTATION.md)
- [Quick Reference](./RBAC_QUICK_REFERENCE.md)
- [Installation Guide](./INSTALLATION.md)
- [Database README](./database/README.md)

## 🆘 Getting Help

1. Check error logs: `backend/logs/` or console
2. Review documentation files
3. Check database connectivity
4. Verify all dependencies installed
5. Clear node_modules and reinstall

## ✅ Setup Verification Checklist

- [ ] Node.js and npm installed
- [ ] MySQL/MariaDB running
- [ ] Database created and restored
- [ ] Backend `.env` configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] RBAC tables created
- [ ] Default profiles seeded
- [ ] Users assigned to profiles
- [ ] Backend server running (port 3000)
- [ ] Frontend server running (port 5173)
- [ ] Can login successfully
- [ ] Sidebar shows correct modules per profile
- [ ] CRUD operations work
- [ ] Profile management accessible (admin)

---

**Last Updated**: November 25, 2025  
**Version**: 1.0.0 with RBAC  
**Status**: Production Ready ✅
