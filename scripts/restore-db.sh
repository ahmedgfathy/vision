#!/bin/bash

# Vision CRM - Database Restoration Script
# This script restores the database from the dump file

set -e  # Exit on any error

echo "🗄️  Vision CRM - Database Restoration"
echo "===================================="
echo ""

# Load environment variables from backend/.env if it exists
if [ -f "../backend/.env" ]; then
    echo "📄 Loading database credentials from .env..."
    export $(cat ../backend/.env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found. Using default values."
    DB_HOST="127.0.0.1"
    DB_USER="root"
    DB_NAME="vision_crm"
    read -sp "Enter MySQL password: " DB_PASS
    echo ""
fi

# Check if dump file exists
if [ ! -f "vision_crm_dump.sql" ]; then
    echo "❌ Error: vision_crm_dump.sql not found!"
    echo "   Please ensure the dump file exists in the database/ directory."
    exit 1
fi

echo ""
echo "📊 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   User: $DB_USER"
echo "   Database: $DB_NAME"
echo ""

# Create database if it doesn't exist
echo "🔧 Step 1: Creating database (if not exists)..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "   ✅ Database ready"
else
    echo "   ❌ Failed to create database. Check your credentials."
    exit 1
fi

# Import the dump
echo ""
echo "📥 Step 2: Importing database dump..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < vision_crm_dump.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo "   ✅ Database imported successfully!"
else
    echo "   ❌ Failed to import database dump."
    exit 1
fi

# Verify tables
echo ""
echo "🔍 Step 3: Verifying database structure..."
TABLE_COUNT=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -se "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null)

echo "   ✅ Found $TABLE_COUNT tables"

# Check for RBAC tables
RBAC_CHECK=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -se "SHOW TABLES LIKE 'profiles';" 2>/dev/null)
if [ -n "$RBAC_CHECK" ]; then
    PROFILE_COUNT=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -se "SELECT COUNT(*) FROM profiles;" 2>/dev/null)
    echo "   ✅ RBAC system detected ($PROFILE_COUNT profiles)"
fi

echo ""
echo "✅ Database restoration completed successfully!"
echo ""
echo "📝 Next Steps:"
echo "   1. Start the backend server: cd ../backend && npm run dev"
echo "   2. Start the frontend: cd .. && npm run dev"
echo "   3. Login with your credentials"
echo ""
echo "🔐 Don't forget to:"
echo "   - Update user passwords if needed"
echo "   - Assign profiles to users"
echo "   - Review security settings"
echo ""
