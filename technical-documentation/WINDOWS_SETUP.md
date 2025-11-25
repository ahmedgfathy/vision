# 🚀 Quick Start Guide - Windows PC Setup

## The Problem

On your **Mac**, the app worked without running backend locally because it was probably using a remote backend server.

On **Windows**, the frontend is configured to use `http://localhost:3000/api`, which means **you MUST run the backend server locally**.

---

## ✅ Complete Setup Steps

### Step 1: Make Sure MySQL is Running

```bash
# Check MySQL status
sudo service mysql status

# If not running, start it
sudo service mysql start
```

### Step 2: Check Database Exists

```bash
# Login to MySQL
mysql -u root -p
# Enter your password (probably 'zerocall')

# Check databases
SHOW DATABASES;

# You should see 'vision_crm' in the list
# If not, create it:
CREATE DATABASE vision_crm;
exit;
```

### Step 3: Import Database (If Empty)

```bash
cd ~/vision/database
mysql -u root -p vision_crm < vision_crm_dump.sql
```

### Step 4: Configure Backend .env

```bash
cd ~/vision/backend
cat .env
```

**It should contain:**
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=zerocall
DB_NAME=vision_crm
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

**Important**: Make sure `DB_PASS` matches your MySQL password!

### Step 5: Install Backend Dependencies (If Not Done)

```bash
cd ~/vision/backend
npm install
```

### Step 6: Start the Backend Server

```bash
cd ~/vision/backend
npm run dev
```

**✅ You MUST see:**
```
Database connected successfully
Server is running on port 3000
```

**❌ If you see errors:**
- Check MySQL is running
- Check .env has correct password
- Run: `node utils/testConnection.js`

**Keep this terminal open!** The backend must stay running.

### Step 7: Start Frontend (New Terminal)

Open a **NEW terminal** (keep backend running in the first one):

```bash
cd ~/vision
npm run dev
```

You should see:
```
VITE vX.X.X ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 8: Login

1. Open browser: `http://localhost:5173`
2. Login with:
   - **Email**: `admin@vision.com`
   - **Password**: `zerocall`

---

## 🎯 Both Servers Must Be Running

**Terminal 1 - Backend:**
```bash
cd ~/vision/backend
npm run dev
# Output: Server is running on port 3000 ✅
```

**Terminal 2 - Frontend:**
```bash
cd ~/vision
npm run dev
# Output: Local: http://localhost:5173/ ✅
```

---

## 🔧 Troubleshooting

### Backend Won't Start

```bash
cd ~/vision/backend
node utils/testConnection.js
```

This will tell you exactly what's wrong!

### "Database connection failed"

Check MySQL password in `.env`:
```bash
cat ~/vision/backend/.env | grep DB_PASS
```

Test it:
```bash
mysql -u root -p -h 127.0.0.1
# Enter the same password
```

### "Database does not exist"

```bash
mysql -u root -p -e "CREATE DATABASE vision_crm;"
cd ~/vision/database
mysql -u root -p vision_crm < vision_crm_dump.sql
```

### Still Can't Login

Reset admin password:
```bash
cd ~/vision/backend
node utils/resetPassword.js admin@vision.com zerocall
```

---

## 📋 Daily Startup Routine

Every time you want to use Vision CRM on Windows:

```bash
# Terminal 1 - Backend
cd ~/vision/backend
npm run dev

# Terminal 2 - Frontend  
cd ~/vision
npm run dev

# Open browser
# http://localhost:5173
```

---

## 🆚 Mac vs Windows Difference

| Aspect | Mac | Windows (WSL) |
|--------|-----|---------------|
| Backend Server | Remote or not needed? | **Must run locally** |
| Database | Remote? | **Local MySQL** |
| Terminals Needed | 1 (frontend only) | **2 (backend + frontend)** |
| Port 3000 | Not used | **MUST be running** |

---

## ⚡ Quick Test

After starting both servers, test the backend:

```bash
curl http://localhost:3000/
```

**Expected:**
```json
{"message":"Welcome to Vision CRM API"}
```

If this fails, backend is not running correctly!

---

**Follow these steps and both servers will be running correctly!** 🚀
