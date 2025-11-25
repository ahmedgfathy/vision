# 📦 Database Backup Guide

## Quick Backup

Run this command in your WSL terminal:

```bash
cd ~/vision

# If you know your MySQL password
mysqldump -u root -p vision_crm --add-drop-database --routines --triggers --events > database/vision_crm_latest.sql

# You'll be prompted for password
```

---

## Using the Backup Script

```bash
cd ~/vision
chmod +x database/backup_db.sh

# Set password (optional)
export DB_PASS="your_mysql_password"

# Run backup
bash database/backup_db.sh
```

---

## What Gets Backed Up

✅ **Complete Database Schema**
- All tables with structure
- Indexes and constraints
- Foreign keys

✅ **All Data**
- Users (admin, agents, etc.)
- Profiles & permissions
- Properties
- Dropdown lists
- Everything!

✅ **Routines & Triggers**
- Stored procedures
- Functions
- Triggers
- Events

---

## After Backup

### 1. Check the file
```bash
ls -lh database/vision_crm_latest.sql
```

### 2. Add to Git
```bash
git add database/vision_crm_latest.sql
git commit -m "Updated database dump with latest schema and data"
git push
```

---

## Restore on Another Machine

```bash
# Create database and restore
mysql -u root -p < database/vision_crm_latest.sql

# Done! Database is restored
```

---

## Current Database Contents

Your dump will include:

1. **Users**
   - admin@vision.com (admin role)
   - Other users if any

2. **Profiles**
   - Admin profile (full access)
   - Sales profile
   - Agent profile

3. **Tables**
   - properties
   - owner_info
   - more_info
   - update_info
   - property_gallery
   - profiles ✨ (with unique constraints)
   - profile_modules ✨ (with unique constraints)
   - profile_fields ✨ (with unique constraints)
   - dynamic_lists
   - users
   - roles
   - audit_logs
   - And more...

4. **Important Updates**
   - ✅ Unique constraints on profile tables
   - ✅ Latest schema changes
   - ✅ Default admin user with correct password hash

---

## Alternative: Manual Export

If the script doesn't work:

```bash
cd ~/vision

# Simple version (no password in command)
mysqldump -u root -p vision_crm > database/vision_crm_latest.sql

# With all options
mysqldump -u root -p \
  --databases vision_crm \
  --add-drop-database \
  --routines \
  --triggers \
  --events \
  --single-transaction \
  > database/vision_crm_latest.sql
```

---

**After creating the dump, you can push it to GitHub!** 🚀
