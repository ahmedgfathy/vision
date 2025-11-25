# RBAC + Profile Permission System

## Overview

A comprehensive Role-Based Access Control (RBAC) system with module-level and field-level permissions for the Vision CRM Real Estate platform.

## Features

### 1. **Module-Level Permissions**
Control access to entire modules with granular actions:
- **View** - Can see the module
- **Create** - Can add new records
- **Edit** - Can modify existing records
- **Delete** - Can remove records

### 2. **Field-Level Permissions**
Fine-grained control over individual fields:
- **View** - Field is visible in UI and API responses
- **Edit** - Field can be modified (requires View)
- **Hidden** - Field is completely removed from forms and responses

### 3. **Profile-Based System**
Users are assigned to profiles which define their permissions:
- Admin Profile - Full system access
- Sales Profile - View-only access
- Agent Profile - Can manage assigned properties
- Custom Profiles - Create unlimited custom permission sets

## Database Schema

### Tables Created

```sql
-- profiles: Define permission groups
CREATE TABLE profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- profile_modules: Module-level permissions
CREATE TABLE profile_modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT,
    module_name VARCHAR(100),
    permission_view BOOLEAN DEFAULT FALSE,
    permission_create BOOLEAN DEFAULT FALSE,
    permission_edit BOOLEAN DEFAULT FALSE,
    permission_delete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- profile_fields: Field-level permissions
CREATE TABLE profile_fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT,
    module_name VARCHAR(100),
    field_name VARCHAR(100),
    can_view BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- users: Add profile assignment
ALTER TABLE users ADD COLUMN profile_id INT;
```

## Setup Instructions

### 1. Run Database Migration

```bash
cd backend
node utils/runMigration.js
```

### 2. Seed Default Profiles

```bash
node utils/seedProfiles.js
```

This creates three default profiles:
- **Admin** - Full access to all modules and fields
- **Sales** - View-only access to properties and leads
- **Agent** - Can edit properties, manage leads, hidden owner contact info

### 3. Assign Profiles to Users

Update existing users via MySQL:

```sql
-- Assign admin profile to admin user
UPDATE users SET profile_id = 1 WHERE email = 'admin@vision.com';

-- Assign sales profile to sales users
UPDATE users SET profile_id = 2 WHERE role = 'sales';

-- Assign agent profile to agent users
UPDATE users SET profile_id = 3 WHERE role = 'agent';
```

## Backend Implementation

### Middleware Usage

The RBAC system provides three middleware functions:

#### 1. Module Permission Check
```javascript
const { checkModulePermission } = require('../middleware/rbacMiddleware');

router.get('/properties', 
  authenticateToken,
  checkModulePermission('properties', 'view'),
  propertyController.getAll
);
```

#### 2. Field Filtering
```javascript
const { filterResponseFields } = require('../middleware/rbacMiddleware');

router.get('/properties/:id', 
  authenticateToken,
  checkModulePermission('properties', 'view'),
  filterResponseFields('properties'),
  propertyController.getOne
);
```

#### 3. Field Edit Validation
```javascript
const { validateFieldEdits } = require('../middleware/rbacMiddleware');

router.put('/properties/:id', 
  authenticateToken,
  checkModulePermission('properties', 'edit'),
  validateFieldEdits('properties'),
  propertyController.update
);
```

### Permission Service

```javascript
const PermissionService = require('../services/permissionService');

// Get user permissions
const permissions = await PermissionService.getUserPermissions(userId);

// Check module permission
const canView = PermissionService.hasModulePermission(permissions, 'properties', 'view');

// Check field permission
const canEdit = PermissionService.canEditField(permissions, 'properties', 'total_price');

// Filter object fields
const filtered = PermissionService.filterFields(permissions, 'properties', data);
```

## Frontend Implementation

### Permission Store

```javascript
import { usePermissionStore } from '@/stores/permissions';

const permissionStore = usePermissionStore();

// Load permissions (auto-loaded on login)
await permissionStore.loadPermissions();

// Check module permission
if (permissionStore.hasModulePermission('properties', 'create')) {
  // Show create button
}

// Check field permission
if (permissionStore.canViewField('properties', 'total_price')) {
  // Render field
}

// Check if field is editable
const isReadOnly = !permissionStore.canEditField('properties', 'total_price');
```

### Dynamic Sidebar

The sidebar automatically hides modules based on permissions:

```vue
<router-link 
  v-if="canViewModule('properties')"
  to="/dashboard/properties"
>
  Properties
</router-link>
```

### Dynamic Forms

Forms can be made permission-aware:

```vue
<template>
  <div v-if="permissionStore.canViewField('properties', 'total_price')">
    <input
      v-model="property.total_price"
      :readonly="!permissionStore.canEditField('properties', 'total_price')"
    />
  </div>
</template>

<script setup>
import { usePermissionStore } from '@/stores/permissions';
const permissionStore = usePermissionStore();
</script>
```

## Admin UI

### Access Profile Management

Navigate to: **Dashboard → Profiles & Permissions** (Admin only)

### Create/Edit Profiles

1. Click "Create Profile"
2. Enter name and description
3. Click "Edit Permissions" icon (shield)
4. Configure module and field permissions
5. Save

### Module Permission Matrix

Check boxes for each module:
- ✓ View - Module appears in navigation
- ✓ Create - Can add new records
- ✓ Edit - Can modify records
- ✓ Delete - Can remove records

### Field Permission Matrix

For each module, set individual field permissions:
- ✓ View - Field is visible
- ✓ Edit - Field is editable (requires View)
- ☐ Both unchecked - Field is hidden

## Available Modules

- properties
- owner_info
- update_info
- more_info
- gallery
- leads
- agents
- companies
- tasks
- dropdown_management
- users
- profiles
- permissions
- audit_logs
- dashboard

## Security Features

### Backend Enforcement
- All API endpoints check permissions before execution
- Hidden fields are removed from API responses
- Edit attempts on non-editable fields return 403
- All permission denials are logged in audit_log

### Admin Bypass
- Users with role='admin' bypass all permission checks
- Admins always have full access regardless of profile

### Audit Logging
All RBAC events are logged:
- Access denied attempts
- Field edit denials
- Permission changes
- Profile assignments

## API Endpoints

### Profiles
- `GET /api/profiles` - List all profiles (admin)
- `GET /api/profiles/:id` - Get profile with permissions (admin)
- `POST /api/profiles` - Create profile (admin)
- `PUT /api/profiles/:id` - Update profile (admin)
- `DELETE /api/profiles/:id` - Delete profile (admin)

### Permissions
- `POST /api/profiles/:id/modules` - Set module permissions (admin)
- `POST /api/profiles/:id/fields` - Set field permissions (admin)
- `GET /api/profiles/my-permissions` - Get current user permissions
- `GET /api/profiles/modules-fields` - Get available modules and fields

## Example Use Cases

### 1. Sales Team - View Only
**Scenario**: Sales team needs to see properties but not edit pricing

**Configuration**:
- Module: properties → View ✓, Create ☐, Edit ☐, Delete ☐
- Fields: All fields → View ✓, Edit ☐

### 2. Agent - Manage Assigned Properties
**Scenario**: Agents can edit properties but not see owner contact

**Configuration**:
- Module: properties → View ✓, Create ✓, Edit ✓, Delete ☐
- Fields: 
  - owner_name → View ✓, Edit ☐
  - mobile → View ☐, Edit ☐ (hidden)
  - total_price → View ✓, Edit ☐ (read-only)

### 3. Manager - Full Access Except Delete
**Scenario**: Managers can do everything except delete records

**Configuration**:
- All Modules → View ✓, Create ✓, Edit ✓, Delete ☐
- All Fields → View ✓, Edit ✓

## Testing

### Test Module Permissions
```bash
# As sales user (view only)
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/properties

# Try to create (should fail with 403)
curl -X POST -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/properties \
  -d '{"unit_for": "For Sale"}'
```

### Test Field Permissions
```bash
# Response should exclude hidden fields
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/properties/1

# Try to edit non-editable field (should fail)
curl -X PUT -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/properties/1 \
  -d '{"total_price": 500000}'
```

## Troubleshooting

### Permissions Not Loading
- Check that user has profile_id assigned
- Verify profile has module permissions set
- Clear localStorage and re-login

### Fields Still Visible
- Ensure field permissions are set correctly
- Check that filterResponseFields middleware is applied
- Verify frontend is checking canViewField

### Admin Can't Access
- Admin role bypasses all checks
- Ensure user.role === 'admin'
- Check authenticateToken middleware is working

## Future Enhancements

- [ ] Row-level permissions (user can only edit own records)
- [ ] Time-based permissions (access expires after date)
- [ ] IP-based restrictions
- [ ] Permission templates/presets
- [ ] Bulk user assignment
- [ ] Permission inheritance
- [ ] Export/import permission configurations

## Support

For issues or questions, check:
- `/backend/services/permissionService.js` - Core logic
- `/backend/middleware/rbacMiddleware.js` - Enforcement
- `/src/stores/permissions.js` - Frontend state
- `/src/views/admin/Profiles.vue` - Admin UI
