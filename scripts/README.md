# Scripts

This folder contains all utility scripts for the Vision CRM project.

## 📂 Folder Structure

### Root Scripts
- **setup-rbac.sh** - Automated RBAC setup
- **diagnose.sh** - System diagnostics
- **backup_db.sh** - Database backup
- **create-dump.sh** - Create database dump
- **restore-db.sh** - Restore database from dump

### Backend Utilities (`backend-utils/`)
Test and diagnostic utilities:
- **checkSchema.js** - Verify database schema
- **checkUsers.js** - Check user data
- **testConnection.js** - Test database connection
- **testProfileSave.js** - Test profile save functionality
- **resetPassword.js** - Reset user password
- **fixProfileTables.js** - Fix profile table issues

## 🚀 Usage

### Database Operations
```bash
# Backup database
cd scripts
./backup_db.sh

# Create fresh dump
./create-dump.sh

# Restore from dump
./restore-db.sh
```

### RBAC Setup
```bash
# Run RBAC setup
cd scripts
./setup-rbac.sh
```

### Diagnostics
```bash
# Run system diagnostics
./diagnose.sh

# Test database connection
cd backend-utils
node testConnection.js

# Check database schema
node checkSchema.js
```

### User Management
```bash
# Reset user password
cd backend-utils
node resetPassword.js
```

## ⚠️ Important Notes

1. **Required Files**: These scripts are essential for system maintenance
2. **Database Scripts**: Always backup before running database operations
3. **Test Scripts**: Use in development environment only
4. **Backend Utils**: Run from backend directory context

---

See [Technical Documentation](../technical-documentation/) for detailed guides.
