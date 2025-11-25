# RBAC Quick Reference Guide

## 🎯 Common Use Cases

### 1. Check Module Permission in Vue Component

```vue
<template>
  <button v-if="canCreate('properties')" @click="createProperty">
    Add Property
  </button>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions';

const { canCreate } = usePermissions();
</script>
```

### 2. Conditional Field Rendering

```vue
<template>
  <div v-if="canViewField('properties', 'total_price')">
    <label>Price</label>
    <input
      v-model="property.total_price"
      :readonly="!canEditField('properties', 'total_price')"
    />
  </div>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions';

const { canViewField, canEditField } = usePermissions();
</script>
```

### 3. Backend Route Protection

```javascript
router.get('/properties',
  authenticateToken,
  checkModulePermission('properties', 'view'),
  filterResponseFields('properties'),
  propertyController.getAll
);
```

### 4. Field Edit Validation

```javascript
router.put('/properties/:id',
  authenticateToken,
  checkModulePermission('properties', 'edit'),
  validateFieldEdits('properties'),
  propertyController.update
);
```

### 5. Get User Permissions in Controller

```javascript
const permissions = await PermissionService.getUserPermissions(req.user.id);

if (!PermissionService.hasModulePermission(permissions, 'properties', 'delete')) {
  return res.status(403).json({ error: 'Access denied' });
}
```

## 🔑 Permission Store Methods

```javascript
import { usePermissionStore } from '@/stores/permissions';

const permissionStore = usePermissionStore();

// Module permissions
permissionStore.hasModulePermission('properties', 'view')
permissionStore.hasModulePermission('properties', 'create')
permissionStore.hasModulePermission('properties', 'edit')
permissionStore.hasModulePermission('properties', 'delete')

// Field permissions
permissionStore.canViewField('properties', 'total_price')
permissionStore.canEditField('properties', 'total_price')
permissionStore.getFieldPermission('properties', 'total_price')

// Lists
permissionStore.visibleModules // Array of module names
permissionStore.visibleFields('properties') // Array of field names
permissionStore.editableFields('properties') // Array of field names

// Load/clear
await permissionStore.loadPermissions()
permissionStore.clearPermissions()
```

## 🛠️ Composable (Recommended)

```javascript
import { usePermissions } from '@/composables/usePermissions';

const {
  canView,
  canCreate,
  canEdit,
  canDelete,
  canViewField,
  canEditField,
  isAdmin
} = usePermissions();

// Use in template
if (canCreate('properties')) { ... }
if (canEditField('properties', 'total_price')) { ... }
if (isAdmin) { ... }
```

## 📋 Available Modules

- `dashboard`
- `properties`
- `owner_info`
- `update_info`
- `more_info`
- `gallery`
- `leads`
- `agents`
- `companies`
- `tasks`
- `dropdown_management`
- `users`
- `profiles`
- `permissions`
- `audit_logs`

## 🗂️ Property Fields

```javascript
// UnitOfferSection
'unit_for', 'area_id'

// UnitLicenseSection
'unit_license', 'mall_id', 'community_id'

// UnitInfoSection
'type_id', 'finished', 'building', 'bedrooms', 'bathrooms', 
'parking_spaces', 'total_price', 'unit_no', 'more_units', 
'description', 'furnished', 'has_pool', 'has_gym', 'has_security',
'has_garden', 'has_balcony', 'has_elevator'

// OwnerInfoSection
'offered_by', 'update_state', 'owner_name', 'mobile', 'tel',
'last_follow_in', 'call_update', 'new_feedback', 'call_note'

// UpdateInfoSection
'reminder_time', 'rent_to', 'reminder_date', 'repeated_statement'

// MoreInfoSection
'property_name', 'handler_id', 'phase', 'latitude', 'longitude'
```

## 🔐 Admin Operations

### Create Profile via API

```javascript
POST /api/profiles
{
  "name": "Custom Profile",
  "description": "Custom permissions",
  "is_active": true
}
```

### Set Module Permissions

```javascript
POST /api/profiles/:id/modules
{
  "modules": [
    {
      "module_name": "properties",
      "permission_view": true,
      "permission_create": true,
      "permission_edit": true,
      "permission_delete": false
    }
  ]
}
```

### Set Field Permissions

```javascript
POST /api/profiles/:id/fields
{
  "fields": [
    {
      "module_name": "properties",
      "field_name": "total_price",
      "can_view": true,
      "can_edit": false
    }
  ]
}
```

## 💾 Database Queries

### Assign Profile to User

```sql
UPDATE users SET profile_id = 1 WHERE id = 123;
```

### Get User's Profile

```sql
SELECT u.*, p.name as profile_name 
FROM users u 
LEFT JOIN profiles p ON u.profile_id = p.id 
WHERE u.id = 123;
```

### Get Profile Permissions

```sql
-- Module permissions
SELECT * FROM profile_modules WHERE profile_id = 1;

-- Field permissions
SELECT * FROM profile_fields WHERE profile_id = 1;
```

## 🎨 UI Examples

### Conditional Menu Items

```vue
<router-link 
  v-if="canView('properties')"
  to="/dashboard/properties"
>
  Properties
</router-link>
```

### Conditional Buttons

```vue
<button 
  v-if="canCreate('properties')" 
  @click="createNew"
>
  Add Property
</button>

<button 
  v-if="canEdit('properties')" 
  @click="editRecord"
>
  Edit
</button>

<button 
  v-if="canDelete('properties')" 
  @click="deleteRecord"
>
  Delete
</button>
```

### Dynamic Form Fields

```vue
<div v-for="field in visiblePropertyFields" :key="field">
  <label>{{ formatFieldName(field) }}</label>
  <input
    v-model="property[field]"
    :readonly="!canEditField('properties', field)"
  />
</div>
```

## 🧪 Testing Scenarios

### Test View Permission

```bash
# Login as user with view-only
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/properties

# Should return data

# Try to create
curl -X POST -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/properties \
  -d '{"unit_for": "For Sale"}'

# Should return 403
```

### Test Field Filtering

```bash
# User with hidden mobile field
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/properties/1

# Response should not include 'mobile' field
```

### Test Edit Restriction

```bash
# User with read-only total_price
curl -X PUT -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/properties/1 \
  -d '{"total_price": 999999}'

# Should return 403 with field edit denied message
```

## 📖 Best Practices

1. **Always use composable in Vue components**
   ```javascript
   const { canView, canEdit } = usePermissions();
   ```

2. **Apply all three middleware for full protection**
   ```javascript
   checkModulePermission() → validateFieldEdits() → filterResponseFields()
   ```

3. **Test with non-admin users**
   - Create test users with different profiles
   - Verify permissions work correctly

4. **Document custom profiles**
   - Keep track of organization-specific profiles
   - Document special permission configurations

5. **Regular audits**
   - Review profiles periodically
   - Remove unused profiles
   - Update permissions as needed

---

**Quick Links:**
- Full Documentation: [`RBAC_DOCUMENTATION.md`](./RBAC_DOCUMENTATION.md)
- Implementation Summary: [`RBAC_SUMMARY.md`](./RBAC_SUMMARY.md)
- Setup Script: [`setup-rbac.sh`](./setup-rbac.sh)
