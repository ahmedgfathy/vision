# Vision CRM - RBAC System Documentation Index

## 📚 Complete Documentation Set

### Getting Started
1. **[INSTALLATION.md](./INSTALLATION.md)** - Complete installation guide
   - Prerequisites and setup
   - Step-by-step installation
   - Verification and testing
   - Troubleshooting

### Understanding the System
2. **[RBAC_DOCUMENTATION.md](./RBAC_DOCUMENTATION.md)** - Comprehensive technical documentation
   - System overview and features
   - Database schema
   - Backend implementation
   - Frontend implementation
   - Security features
   - API endpoints
   - Examples and use cases

3. **[RBAC_SUMMARY.md](./RBAC_SUMMARY.md)** - Implementation summary
   - What was built
   - Files created/modified
   - Default profiles
   - Configuration guide
   - Testing checklist

### Quick Reference
4. **[RBAC_QUICK_REFERENCE.md](./RBAC_QUICK_REFERENCE.md)** - Code snippets and examples
   - Common use cases
   - Permission store methods
   - Composable usage
   - UI examples
   - Database queries
   - Best practices

## 🎯 Where to Start

### For System Administrators
1. Read [INSTALLATION.md](./INSTALLATION.md)
2. Run `./setup-rbac.sh`
3. Assign profiles to users
4. Test with different user roles

### For Developers
1. Review [RBAC_DOCUMENTATION.md](./RBAC_DOCUMENTATION.md)
2. Check [RBAC_QUICK_REFERENCE.md](./RBAC_QUICK_REFERENCE.md)
3. Use `usePermissions()` composable in components
4. Apply middleware to new routes

### For Users
1. Login with assigned profile
2. Access allowed modules
3. Perform permitted actions
4. Contact admin for access requests

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│            Vue.js Frontend                  │
├─────────────────────────────────────────────┤
│  • Permission Store (Pinia)                 │
│  • usePermissions() Composable              │
│  • Dynamic Sidebar                          │
│  • Conditional Rendering                    │
│  • Admin UI for Profile Management          │
└──────────────┬──────────────────────────────┘
               │ HTTP/API
┌──────────────▼──────────────────────────────┐
│         Express.js Backend                  │
├─────────────────────────────────────────────┤
│  • RBAC Middleware                          │
│    - checkModulePermission()                │
│    - filterResponseFields()                 │
│    - validateFieldEdits()                   │
│  • Permission Service                       │
│  • Profile Controller                       │
│  • Audit Logging                            │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│              MySQL Database                 │
├─────────────────────────────────────────────┤
│  • profiles                                 │
│  • profile_modules                          │
│  • profile_fields                           │
│  • users (with profile_id)                  │
└─────────────────────────────────────────────┘
```

## 📂 Key Files

### Backend
```
backend/
├── migrations/
│   └── 001_create_rbac_tables.sql
├── models/
│   └── Profile.js
├── services/
│   └── permissionService.js
├── controllers/
│   └── profileController.js
├── middleware/
│   └── rbacMiddleware.js
├── routes/
│   └── profileRoutes.js
└── utils/
    ├── runMigration.js
    └── seedProfiles.js
```

### Frontend
```
src/
├── stores/
│   └── permissions.js
├── composables/
│   └── usePermissions.js
├── views/
│   └── admin/
│       ├── Profiles.vue
│       └── ProfilePermissions.vue
└── layouts/
    └── AppLayout.vue (updated)
```

### Documentation
```
root/
├── INSTALLATION.md
├── RBAC_DOCUMENTATION.md
├── RBAC_SUMMARY.md
├── RBAC_QUICK_REFERENCE.md
├── RBAC_INDEX.md (this file)
└── setup-rbac.sh
```

## 🔑 Key Concepts

### Module-Level Permissions
- **View** - Can see the module in navigation
- **Create** - Can add new records
- **Edit** - Can modify existing records
- **Delete** - Can remove records

### Field-Level Permissions
- **View** - Field is visible in UI and API
- **Edit** - Field can be modified (requires View)
- **Hidden** - Field is completely removed

### Profiles
- Collections of permissions
- Assigned to users
- Reusable across multiple users
- Can be active/inactive

## 🚀 Quick Commands

```bash
# Setup RBAC system
./setup-rbac.sh

# Or manually:
cd backend
npm run setup-rbac

# Start development
npm run dev          # Frontend (from root)
cd backend && npm run dev  # Backend

# Database operations
npm run migrate       # Run migration
npm run seed-profiles # Create default profiles
```

## 📊 Default Profiles

| Profile | Access Level | Modules | Field Restrictions |
|---------|-------------|---------|-------------------|
| **Admin** | Full access | All | None |
| **Sales** | View only | Properties, Leads, Dashboard | All read-only |
| **Agent** | Manage assigned | Properties, Leads, Tasks, Owner Info | Price read-only, Owner mobile hidden |

## 🎨 Common Patterns

### Vue Component with Permissions
```vue
<template>
  <div>
    <!-- Module-level check -->
    <button v-if="canCreate('properties')">Add Property</button>
    
    <!-- Field-level check -->
    <input 
      v-if="canViewField('properties', 'total_price')"
      v-model="property.total_price"
      :readonly="!canEditField('properties', 'total_price')"
    />
  </div>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions';
const { canCreate, canViewField, canEditField } = usePermissions();
</script>
```

### Backend Route Protection
```javascript
router.post('/properties',
  authenticateToken,
  checkModulePermission('properties', 'create'),
  validateFieldEdits('properties'),
  propertyController.create
);
```

## 🧪 Testing Workflow

1. **Create Profile** → Set permissions → Assign to user
2. **Login as user** → Verify modules visible/hidden
3. **Test CRUD** → Create, edit, delete operations
4. **Check fields** → Verify visible/hidden/read-only
5. **API testing** → Test backend enforcement
6. **Audit logs** → Review access attempts

## 📞 Support & Resources

### Documentation
- [Installation Guide](./INSTALLATION.md) - Setup instructions
- [Technical Docs](./RBAC_DOCUMENTATION.md) - Deep dive
- [Quick Reference](./RBAC_QUICK_REFERENCE.md) - Code examples
- [Summary](./RBAC_SUMMARY.md) - What was built

### Code References
- Permission Service: `backend/services/permissionService.js`
- RBAC Middleware: `backend/middleware/rbacMiddleware.js`
- Permission Store: `src/stores/permissions.js`
- Composable: `src/composables/usePermissions.js`

### Key APIs
- `GET /api/profiles` - List profiles
- `POST /api/profiles` - Create profile
- `POST /api/profiles/:id/modules` - Set module permissions
- `POST /api/profiles/:id/fields` - Set field permissions
- `GET /api/profiles/my-permissions` - Get current user permissions

## 🎓 Learning Path

1. **Day 1**: Installation & Setup
   - Run setup script
   - Verify tables created
   - Check default profiles

2. **Day 2**: Understanding Concepts
   - Read documentation
   - Review database schema
   - Understand permission flow

3. **Day 3**: Admin Training
   - Access admin UI
   - Create custom profile
   - Set module permissions
   - Set field permissions
   - Assign to test user

4. **Day 4**: Testing
   - Test with different profiles
   - Verify UI changes
   - Test API endpoints
   - Review audit logs

5. **Day 5**: Production Ready
   - Create production profiles
   - Assign all users
   - Document custom configs
   - Train team

## ✅ Implementation Checklist

- [x] Database migration completed
- [x] Default profiles seeded
- [x] Backend services implemented
- [x] RBAC middleware created
- [x] API routes protected
- [x] Frontend store created
- [x] Admin UI built
- [x] Sidebar updated with permissions
- [x] Composable created for easy use
- [x] Documentation completed
- [ ] Users assigned to profiles
- [ ] Custom profiles created
- [ ] System tested with all roles
- [ ] Team trained on usage

## 🔄 Maintenance

### Regular Tasks
- Review and update profiles quarterly
- Audit user assignments monthly
- Check audit logs for denied access
- Remove inactive profiles
- Update permissions as features added

### When Adding New Features
1. Add module to `AVAILABLE_MODULES`
2. Define fields in `MODULE_FIELDS`
3. Apply middleware to routes
4. Update admin UI if needed
5. Document new permissions

---

## 📖 Document Navigation

- **[← Back to Installation](./INSTALLATION.md)**
- **[View Technical Documentation →](./RBAC_DOCUMENTATION.md)**
- **[Quick Reference →](./RBAC_QUICK_REFERENCE.md)**
- **[Implementation Summary →](./RBAC_SUMMARY.md)**

---

**Last Updated**: November 25, 2025  
**System Version**: RBAC v1.0  
**Status**: Production Ready ✅
