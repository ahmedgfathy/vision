# 🚀 RBAC System Installation Guide

## Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn
- Vision CRM base system installed

## Step-by-Step Installation

### Method 1: Automated Setup (Recommended)

```bash
# Make script executable
chmod +x setup-rbac.sh

# Run setup
./setup-rbac.sh
```

This will:
1. Install dependencies
2. Run database migration
3. Seed default profiles (Admin, Sales, Agent)

### Method 2: Manual Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

#### 2. Run Database Migration

```bash
# Option A: Using npm script
npm run migrate

# Option B: Direct execution
node utils/runMigration.js
```

This creates:
- `profiles` table
- `profile_modules` table
- `profile_fields` table
- Adds `profile_id` to `users` table

#### 3. Seed Default Profiles

```bash
# Option A: Using npm script
npm run seed-profiles

# Option B: Direct execution
node utils/seedProfiles.js
```

This creates three profiles:
- **Admin Profile** (ID: 1) - Full access
- **Sales Profile** (ID: 2) - View only
- **Agent Profile** (ID: 3) - Edit properties

#### 4. Assign Profiles to Users

```sql
-- Connect to MySQL
mysql -u root -p vision_crm

-- Assign admin profile to admin user
UPDATE users SET profile_id = 1 WHERE email = 'admin@example.com';

-- Assign sales profile
UPDATE users SET profile_id = 2 WHERE role = 'sales';

-- Assign agent profile
UPDATE users SET profile_id = 3 WHERE role = 'agent';

-- Verify assignments
SELECT id, email, role, profile_id FROM users;
```

### Method 3: Combined Backend Setup

```bash
cd backend
npm run setup-rbac
```

This runs both migration and seeding in one command.

## Verification

### 1. Check Database Tables

```sql
-- Verify tables created
SHOW TABLES LIKE 'profile%';

-- Should show:
-- profile_fields
-- profile_modules
-- profiles

-- Check profiles
SELECT * FROM profiles;

-- Check module permissions
SELECT p.name, pm.module_name, pm.permission_view, pm.permission_create, 
       pm.permission_edit, pm.permission_delete
FROM profiles p
JOIN profile_modules pm ON p.id = pm.profile_id
ORDER BY p.name, pm.module_name;
```

### 2. Start Backend Server

```bash
cd backend

# Development mode
npm run dev

# Production mode
npm start
```

Expected output:
```
Server is running on port 3000
```

### 3. Start Frontend

```bash
# From project root
npm run dev
```

Expected output:
```
VITE v7.2.4 ready in XXX ms
Local: http://localhost:5173/
```

### 4. Test Login

1. Navigate to `http://localhost:5173`
2. Login as admin user
3. Check that permissions are loaded (open browser console):
   ```javascript
   // In browser console
   localStorage.getItem('user')
   // Should show user with profile_id
   ```

### 5. Access Admin UI

1. Navigate to `Dashboard → Profiles & Permissions`
2. You should see three profiles listed
3. Click shield icon to view/edit permissions

## Troubleshooting

### Migration Fails

**Error**: `Error: connect ECONNREFUSED`

**Solution**: Check MySQL is running and credentials in `.env` are correct

```bash
# .env file should have:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vision_crm
```

**Error**: `Table 'profiles' already exists`

**Solution**: Tables already created, skip migration or drop tables first

```sql
DROP TABLE IF EXISTS profile_fields;
DROP TABLE IF EXISTS profile_modules;
DROP TABLE IF EXISTS profiles;
```

### Seeding Fails

**Error**: `ER_DUP_ENTRY: Duplicate entry 'Admin' for key 'name'`

**Solution**: Profiles already exist, no action needed

### Permissions Not Loading

**Symptom**: User logs in but permissions don't work

**Solutions**:

1. Check user has profile assigned:
   ```sql
   SELECT profile_id FROM users WHERE id = YOUR_USER_ID;
   ```

2. Clear browser cache and localStorage:
   ```javascript
   localStorage.clear();
   ```

3. Check backend is running and accessible:
   ```bash
   curl http://localhost:3000/api/profiles/my-permissions \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Profile Page Not Showing

**Symptom**: Can't access `/dashboard/admin/profiles`

**Solutions**:

1. Verify user role is 'admin':
   ```sql
   SELECT role FROM users WHERE id = YOUR_USER_ID;
   ```

2. Check route is registered (look for errors in browser console)

3. Ensure user is logged in with valid token

### Frontend Compilation Error

**Error**: `Unexpected keyword 'import'`

**Solution**: Check for duplicate import statements in components

## Post-Installation Configuration

### 1. Create Custom Profiles

1. Login as admin
2. Go to `Dashboard → Profiles & Permissions`
3. Click "Create Profile"
4. Enter name and description
5. Click save
6. Click shield icon to set permissions

### 2. Configure Module Permissions

1. Select profile to edit
2. Go to "Module Permissions" tab
3. Check boxes for desired permissions:
   - ✓ View - Show module in navigation
   - ✓ Create - Allow creating records
   - ✓ Edit - Allow editing records
   - ✓ Delete - Allow deleting records
4. Click "Save"

### 3. Configure Field Permissions

1. Select profile to edit
2. Go to "Field Permissions" tab
3. For each module, check boxes for fields:
   - ✓ View - Field is visible
   - ✓ Edit - Field is editable (requires View)
4. Click "Save"

### 4. Assign Profiles to Users

```sql
UPDATE users SET profile_id = ? WHERE id = ?;
```

Or create user assignment UI (future enhancement)

## Testing the Installation

### Test 1: Admin Access

```bash
# Login as admin
# Navigate to all modules - all should be visible
# Try creating, editing, deleting - all should work
```

### Test 2: Sales Profile (View Only)

```bash
# Assign sales profile to test user
UPDATE users SET profile_id = 2 WHERE id = TEST_USER_ID;

# Login as test user
# Navigate to Properties - should be visible
# Try to create property - button should not appear
# Try to edit property - fields should be read-only
```

### Test 3: Agent Profile

```bash
# Assign agent profile to test user
UPDATE users SET profile_id = 3 WHERE id = TEST_USER_ID;

# Login as test user
# Navigate to Properties - should be visible
# Create new property - should work
# Edit property - most fields editable except total_price
# Owner mobile field - should be hidden
```

### Test 4: API Permissions

```bash
# Get token for sales user
TOKEN="your_sales_user_token"

# Try to view properties (should work)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/properties

# Try to create (should fail with 403)
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"unit_for":"For Sale"}' \
  http://localhost:3000/api/properties
```

## Backup Before Installation

```bash
# Backup database
mysqldump -u root -p vision_crm > backup_before_rbac.sql

# Restore if needed
mysql -u root -p vision_crm < backup_before_rbac.sql
```

## Rollback Instructions

If you need to rollback the RBAC system:

```sql
-- Remove foreign key constraint
ALTER TABLE users DROP FOREIGN KEY users_ibfk_1;

-- Remove profile_id column
ALTER TABLE users DROP COLUMN profile_id;

-- Drop RBAC tables
DROP TABLE IF EXISTS profile_fields;
DROP TABLE IF EXISTS profile_modules;
DROP TABLE IF EXISTS profiles;
```

## Next Steps

1. ✅ Complete installation
2. ✅ Assign profiles to all users
3. ✅ Test with different user roles
4. ✅ Create organization-specific profiles
5. ✅ Train admin users on permission management
6. ✅ Document custom permission configurations

## Support

- **Documentation**: See `RBAC_DOCUMENTATION.md`
- **Quick Reference**: See `RBAC_QUICK_REFERENCE.md`
- **Summary**: See `RBAC_SUMMARY.md`

## Additional Resources

- Permission Service: `/backend/services/permissionService.js`
- RBAC Middleware: `/backend/middleware/rbacMiddleware.js`
- Frontend Store: `/src/stores/permissions.js`
- Composable: `/src/composables/usePermissions.js`

---

**Installation Complete!** 🎉

The RBAC system is now ready to use. Login as admin and navigate to **Dashboard → Profiles & Permissions** to manage user access.
