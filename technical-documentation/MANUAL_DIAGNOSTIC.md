# 🚨 MANUAL DIAGNOSTIC CHECKLIST

Since I can't run commands directly in your WSL, please run these commands yourself and tell me what you see:

## 1️⃣ Check Node.js Version
```bash
node -v
```
**Expected**: v20.x.x or v22.x.x  
**If not**: Run `nvm use 22` or install Node 22

---

## 2️⃣ Check MySQL is Running
```bash
sudo service mysql status
```
**Expected**: `MySQL is running`  
**If not**: Run `sudo service mysql start`

---

## 3️⃣ Check .env File Exists
```bash
cat ~/vision/backend/.env
```
**Expected**: Should show database credentials  
**If error "No such file"**: Run `cp ~/vision/backend/.env.example ~/vision/backend/.env`

---

## 4️⃣ Test MySQL Connection
```bash
mysql -u root -p -h 127.0.0.1
```
**Expected**: MySQL prompt `mysql>`  
**If fails**: Password in .env is wrong

---

## 5️⃣ Check Database Exists
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'vision_crm';"
```
**Expected**: Should show `vision_crm`  
**If empty**: Run `mysql -u root -p -e "CREATE DATABASE vision_crm;"`

---

## 6️⃣ Run Backend Diagnostic
```bash
cd ~/vision/backend
node utils/testConnection.js
```
**This will tell you EXACTLY what's wrong!**

---

## 7️⃣ Try to Start Backend
```bash
cd ~/vision/backend
npm run dev
```

**What do you see?**
- ✅ `Database connected successfully` + `Server is running on port 3000` = GOOD!
- ❌ Any error messages = Tell me the EXACT error

**Keep this running!**

---

## 8️⃣ Test Backend API (New Terminal)
```bash
curl http://localhost:3000/
```
**Expected**: `{"message":"Welcome to Vision CRM API"}`  
**If fails**: Backend is not running

---

## 9️⃣ Start Frontend (New Terminal)
```bash
cd ~/vision
npm run dev
```
**Expected**: `Local: http://localhost:5173/`

---

## 🔟 Try Login
Open browser: `http://localhost:5173`

Try logging in with:
- Email: `admin@vision.com`
- Password: `zerocall`

**What happens?**

---

## 📸 What I Need from You

Please run the commands above and tell me:

1. **What's the output of `node -v`?**
2. **Is MySQL running? (`sudo service mysql status`)**
3. **Does .env file exist? (`cat ~/vision/backend/.env`)**
4. **What happens when you run `node utils/testConnection.js`?**
5. **What happens when you run `npm run dev` in backend?**
6. **Any error messages you see?**

---

## ⚡ Quick All-in-One Diagnostic
```bash
cd ~/vision
chmod +x diagnose.sh
bash diagnose.sh
```

This will check everything and tell you exactly what's wrong!

**Run this and share the output with me!**
