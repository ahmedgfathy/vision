# 🔐 Login Credentials Help

## Problem: Admin Login Not Working

You're trying to login with `admin@vision.com` / `admin123` but it's not working on your Windows PC.

This is likely because:
1. The database on Windows has different user credentials than your Mac
2. The password was changed or never set to `admin123`
3. The user doesn't exist in your current database

---

## 🔍 Step 1: Check What Users Exist

Run this command in your terminal:

```bash
cd ~/vision/backend
node utils/checkUsers.js
```

This will show you:
- All users in the database
- Their email addresses
- Their roles (admin, sales, agent, etc.)
- Their profiles

**Example output:**
```
📋 Users in database:

ID | Username      | Email                  | Role       | Profile
───────────────────────────────────────────────────────────────
1  | admin         | admin@vision.com       | admin      | Admin
2  | sales_user    | sales@vision.com       | sales      | Sales
3  | agent1        | agent@vision.com       | agent      | Agent

👑 Admin users found:
   - admin@vision.com (admin)
```

---

## 🔑 Step 2: Reset the Password

Once you know the correct email address, reset the password:

```bash
cd ~/vision/backend
node utils/resetPassword.js admin@vision.com admin123
```

**Replace:**
- `admin@vision.com` with the actual email from Step 1
- `admin123` with your desired password

**Example output:**
```
✅ Password reset successful!

═══════════════════════════════════════════════════
📧 Email:    admin@vision.com
👤 Username: admin
🔑 Password: admin123
═══════════════════════════════════════════════════

✨ You can now login with these credentials
```

---

## 🚀 Step 3: Try Logging In

1. Make sure backend is running:
   ```bash
   cd ~/vision/backend
   npm run dev
   ```

2. Make sure frontend is running:
   ```bash
   cd ~/vision
   npm run dev
   ```

3. Open browser: `http://localhost:5173`

4. Login with the email and password you just set

---

## 🛠️ Alternative: Direct SQL Query

If the utilities don't work, you can check/reset directly in MySQL:

### Check users:
```bash
mysql -u root -p vision_crm
```

```sql
-- See all users
SELECT id, username, email FROM users;

-- Check admin users
SELECT u.email, r.name as role 
FROM users u 
LEFT JOIN roles r ON u.role_id = r.id 
WHERE r.name = 'admin';
```

### Reset password manually:
```sql
-- Update password (already hashed for 'admin123')
UPDATE users 
SET password_hash = '$2a$10$rQZ5YJxKxGqNqJ0p7DqKxOYVX3W8qZ5gKx7EqHwGxJzKpqH5XqH5S'
WHERE email = 'admin@vision.com';
```

> **Note**: The hash above is for the password `admin123`. 
> For a custom password, use the resetPassword.js utility instead.

---

## 📋 Common Scenarios

### Scenario 1: User doesn't exist
**Symptom**: checkUsers.js shows no admin user

**Solution**: Create admin user in database
```sql
INSERT INTO users (username, email, password_hash, role_id, profile_id) 
VALUES (
  'admin', 
  'admin@vision.com', 
  '$2a$10$rQZ5YJxKxGqNqJ0p7DqKxOYVX3W8qZ5gKx7EqHwGxJzKpqH5XqH5S',
  1,
  1
);
```

### Scenario 2: Different email on different machines
**Symptom**: Mac had `admin@vision.com`, Windows has `admin@example.com`

**Solution**: Either:
- Use the Windows email: `admin@example.com`
- Or reset the Windows email to match Mac

### Scenario 3: Backend not running
**Symptom**: Login page loads but login fails

**Solution**: 
```bash
cd ~/vision/backend
npm run dev
# Should show: Server is running on port 3000
```

---

## 🎯 Quick Fix Commands

All-in-one solution:

```bash
# 1. Check users
cd ~/vision/backend
node utils/checkUsers.js

# 2. Reset admin password (use email from step 1)
node utils/resetPassword.js admin@vision.com admin123

# 3. Start backend
npm run dev

# In another terminal:
# 4. Start frontend
cd ~/vision
npm run dev
```

---

## 🆘 Still Having Issues?

1. **Check backend logs**: Look for "Invalid credentials" errors
2. **Check database connection**: Verify `.env` file has correct MySQL credentials
3. **Try browser console**: Look for network errors (F12 → Console)
4. **Clear browser cache**: Sometimes old data causes issues

---

**The utilities I created (`checkUsers.js` and `resetPassword.js`) will solve 99% of login issues!**
