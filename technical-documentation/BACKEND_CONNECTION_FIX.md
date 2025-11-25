# 🔧 Backend Database Connection Troubleshooting

## Problem: Backend Not Connecting to Database

You're experiencing login failures, likely due to backend database connection issues.

---

## 🚀 Quick Diagnostic (Run This First!)

Open your terminal and run:

```bash
cd ~/vision/backend
node utils/testConnection.js
```

This will automatically check:
- ✅ .env file exists and has all required variables
- ✅ MySQL server is running and accessible
- ✅ Database `vision_crm` exists
- ✅ Required tables exist (users, roles, profiles, etc.)
- ✅ Users table has data
- ✅ Sample queries work

---

## 📋 Common Issues & Solutions

### Issue 1: ".env file not found"

**Solution:**
```bash
cd ~/vision/backend
cp .env.example .env
nano .env  # or use your favorite editor
```

**Required contents:**
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=zerocall
DB_NAME=vision_crm
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d
```

**Important**: Replace `zerocall` with your actual MySQL root password!

---

### Issue 2: "Cannot connect to MySQL server"

**Check if MySQL is running:**
```bash
sudo service mysql status
```

**If not running, start it:**
```bash
sudo service mysql start
```

**Test connection manually:**
```bash
mysql -u root -p -h 127.0.0.1
# Enter your password when prompted
```

If this fails, MySQL credentials are wrong. Update your `.env` file!

---

### Issue 3: "Database 'vision_crm' does not exist"

**Solution - Restore from dump:**
```bash
cd ~/vision/database
chmod +x restore-db.sh
./restore-db.sh
```

**Or create manually:**
```bash
mysql -u root -p -e "CREATE DATABASE vision_crm;"
mysql -u root -p vision_crm < ~/vision/database/vision_crm_dump.sql
```

---

### Issue 4: "Missing tables"

Your database exists but tables are missing.

**Solution:**
```bash
cd ~/vision/database
mysql -u root -p vision_crm < vision_crm_dump.sql
```

---

### Issue 5: "No users found"

Database and tables exist but no user data.

**Solution:**
```bash
cd ~/vision/database
./restore-db.sh
```

---

## 🎯 Complete Fix Workflow

If everything is broken, follow this complete reset:

```bash
# 1. Navigate to project
cd ~/vision

# 2. Check .env exists
cat backend/.env

# If not, create it:
cp backend/.env.example backend/.env
nano backend/.env  # Edit with correct MySQL password

# 3. Make sure MySQL is running
sudo service mysql start
sudo service mysql status

# 4. Drop and recreate database (CAREFUL!)
mysql -u root -p -e "DROP DATABASE IF EXISTS vision_crm; CREATE DATABASE vision_crm;"

# 5. Restore from dump
cd database
mysql -u root -p vision_crm < vision_crm_dump.sql

# 6. Test connection
cd ../backend
node utils/testConnection.js

# 7. Check users exist
node utils/checkUsers.js

# 8. Reset admin password
node utils/resetPassword.js admin@vision.com zerocall

# 9. Start backend
npm run dev
```

---

## ✅ Verify Backend is Working

### 1. Check console logs when starting backend

```bash
cd ~/vision/backend
npm run dev
```

**You should see:**
```
Database connected successfully
Server is running on port 3000
```

**If you see errors**, that means database connection failed!

### 2. Test the API directly

In another terminal:
```bash
curl http://localhost:3000/
```

**Expected response:**
```json
{"message":"Welcome to Vision CRM API"}
```

### 3. Test login endpoint

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vision.com","password":"zerocall"}'
```

**If successful**, you'll get a token.  
**If failed**, check backend console for errors.

---

## 🔍 Check Backend Logs

When you start the backend with `npm run dev`, watch for:

**Good signs:**
```
Database connected successfully ✅
Server is running on port 3000 ✅
```

**Bad signs:**
```
Database connection failed ❌
ECONNREFUSED ❌
ER_ACCESS_DENIED_ERROR ❌
ER_BAD_DB_ERROR ❌
```

If you see bad signs, the issue is in your `.env` file or MySQL isn't running.

---

## 💡 Most Common Cause

**The .env file has the wrong MySQL password!**

Check your `.env`:
```bash
cat ~/vision/backend/.env
```

Make sure `DB_PASS` matches your actual MySQL root password.

**Test it:**
```bash
mysql -u root -p$(grep DB_PASS ~/vision/backend/.env | cut -d'=' -f2) -e "SELECT 1"
```

If this fails, your password is wrong!

---

## 🆘 Still Having Issues?

Run the diagnostic tool and share the output:
```bash
cd ~/vision/backend
node utils/testConnection.js
```

This will tell you exactly what's wrong!

---

## 📱 Frontend Connection Check

Make sure frontend is pointing to the right backend URL.

Check `src/api/axios.js`:
```javascript
baseURL: 'http://localhost:3000/api'  // Should be this
```

---

**After fixing the connection, login should work immediately!**
