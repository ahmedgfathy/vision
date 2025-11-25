# Vision CRM Database

This folder contains the database dump for the Vision CRM system.

## 📦 Contents

- `vision_crm_dump.sql` - Complete database dump including all tables, data, and RBAC schema
- `restore-db.sh` - Automated database restoration script

## 🗄️ Database Structure

The database includes:
- User authentication tables
- Properties management
- Leads, agents, companies
- Tasks management
- **RBAC System** (profiles, profile_modules, profile_fields)
- Dropdown configurations
- Audit logs

## 🚀 Restoring the Database

### Method 1: Using the restore script (Recommended)

```bash
cd database
chmod +x restore-db.sh
./restore-db.sh
```

### Method 2: Manual restoration

```bash
# Create database if it doesn't exist
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vision_crm;"

# Import the dump
mysql -u root -p vision_crm < vision_crm_dump.sql
```

### Method 3: Using environment variables

```bash
# From project root
mysql -u $DB_USER -p$DB_PASS $DB_NAME < database/vision_crm_dump.sql
```

## 🔧 Configuration

Make sure your `.env` file in `/backend` directory has the correct database credentials:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=vision_crm
```

## 📊 Default Users

After restoration, the database includes:

### Admin User
- Email: `admin@vision.com` (check actual data in dump)
- Role: `admin`
- Full system access

### Default RBAC Profiles

1. **Admin Profile** - Full access to all modules and fields
2. **Sales Profile** - View-only access to properties and leads
3. **Agent Profile** - Create/edit properties, manage leads and tasks

## 🔄 Updating the Dump

To create a fresh dump after making changes:

```bash
# From project root
mysqldump -u root -p'your_password' vision_crm > database/vision_crm_dump.sql
```

Or use the automated script:

```bash
cd database
./create-dump.sh
```

## ⚠️ Important Notes

1. **Password Security**: Never commit real passwords to git. The dump should use test/development credentials only.
2. **Data Privacy**: Ensure no sensitive production data is included in the dump.
3. **Version Control**: Consider using `.gitignore` for dumps with real data.
4. **Regular Updates**: Keep the dump updated when schema changes occur.

## 🧪 Testing

After restoration, verify the database:

```bash
# Check tables exist
mysql -u root -p vision_crm -e "SHOW TABLES;"

# Check RBAC tables
mysql -u root -p vision_crm -e "SELECT * FROM profiles;"

# Verify users
mysql -u root -p vision_crm -e "SELECT id, email, role FROM users;"
```

## 📝 Schema Changes

If you need to run migrations separately:

```bash
cd backend
npm run migrate      # Run RBAC migration
npm run seed-profiles # Create default profiles
```

---

**Last Updated**: November 25, 2025  
**Database Version**: vision_crm v1.0 with RBAC
