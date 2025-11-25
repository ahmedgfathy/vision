# 🔧 Fix Profile Permissions Not Saving

## Problem

You're trying to modify Admin profile permissions, but after saving and checking again, the changes aren't persisted.

## Root Cause

The `ON DUPLICATE KEY UPDATE` SQL statement in the Profile models requires **UNIQUE constraints** on the tables to work correctly. If these constraints are missing, the upsert operation fails silently.

---

## ✅ Solution (3 Steps)

### **Step 1: Check if Unique Constraints Exist**

```bash
cd ~/vision/backend
node utils/checkSchema.js
```

**This will show you:**
- Current table schema
- Existing indexes
- Whether unique constraints are missing

**Expected issues:**
```
❌ profile_modules missing UNIQUE KEY on (profile_id, module_name)
❌ profile_fields missing UNIQUE KEY on (profile_id, module_name, field_name)
```

---

### **Step 2: Fix the Schema**

```bash
cd ~/vision/backend
node utils/fixProfileTables.js
```

**This will:**
- Add `UNIQUE KEY unique_profile_module (profile_id, module_name)` to `profile_modules`
- Add `UNIQUE KEY unique_profile_field (profile_id, module_name, field_name)` to `profile_fields`

**Expected output:**
```
✅ Added UNIQUE KEY to profile_modules
✅ Added UNIQUE KEY to profile_fields
✅ Schema fixes applied successfully!
```

---

### **Step 3: Test Permissions Save**

```bash
cd ~/vision/backend
node utils/testProfileSave.js
```

**This will:**
- Save test module permissions
- Save test field permissions
- Verify they were saved correctly
- Show you the results

**Expected output:**
```
✅ All tests passed! Permissions are saving correctly.
```

---

## 🎯 After Fixing

Once the unique constraints are added:

1. **Refresh your browser** (Ctrl+Shift+R)
2. **Login** to the admin panel
3. **Go to Profiles & Permissions**
4. **Edit Admin profile**
5. **Make changes** to module or field permissions
6. **Save**
7. **Click shield icon again** to view - changes should be saved now!

---

## 🔍 What Was Wrong

### Before (Broken):

**profile_modules table:**
````
id | profile_id | module_name | permission_view
1  | 1          | properties  | 1
2  | 1          | properties  | 0  ← Duplicate! No unique constraint
````

Without UNIQUE constraint, `ON DUPLICATE KEY UPDATE` doesn't know which row to update, so it just inserts duplicates or fails silently.

### After (Fixed):

**profile_modules table:**
```
UNIQUE KEY unique_profile_module (profile_id, module_name)
```

Now there can only be ONE row per `(profile_id, module_name)` combination:
```
id | profile_id | module_name | permission_view
1  | 1          | properties  | 1  ← Only one row allowed
```

When you save, MySQL will:
- **Check if row exists** with same (profile_id, module_name)
- **If exists**: UPDATE that row
- **If not exists**: INSERT new row

---

## 📝 Manual Fix (Optional)

If you prefer to run the SQL manually:

```bash
mysql -u root -p vision_crm
```

```sql
-- Check current schema
SHOW INDEX FROM profile_modules;
SHOW INDEX FROM profile_fields;

-- Add unique constraints
ALTER TABLE profile_modules 
ADD UNIQUE KEY unique_profile_module (profile_id, module_name);

ALTER TABLE profile_fields 
ADD UNIQUE KEY unique_profile_field (profile_id, module_name, field_name);

-- Verify
SHOW INDEX FROM profile_modules;
SHOW INDEX FROM profile_fields;

exit;
```

---

## ✅ Verification Checklist

After running the fix, verify:

- [ ] `node utils/checkSchema.js` shows ✅ for both tables
- [ ] `node utils/testProfileSave.js` passes all tests
- [ ] Web UI: Edit profile permissions → Save → Refresh → Check again = Changes persist
- [ ] Backend logs show no errors when saving

---

## 🆘 If Still Not Working

1. **Check backend console** for errors when you click Save
2. **Check browser Network tab** - look for 500 errors on /profiles/:id/modules or /profiles/:id/fields
3. **Check database**:
   ```sql
   SELECT * FROM profile_modules WHERE profile_id = 1;
   SELECT * FROM profile_fields WHERE profile_id = 1;
   ```
4. **Run test script** to see exact error:
   ```bash
   cd ~/vision/backend
   node utils/testProfileSave.js
   ```

---

**The fix script will solve the "permissions not saving" issue!** 🚀
