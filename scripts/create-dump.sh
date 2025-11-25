#!/bin/bash

# Vision CRM - Database Dump Creation Script
# This script creates a fresh database dump

set -e  # Exit on any error

echo "💾 Vision CRM - Database Dump Creation"
echo "======================================"
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

echo ""
echo "📊 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   User: $DB_USER"
echo "   Database: $DB_NAME"
echo ""

# Backup existing dump if it exists
if [ -f "vision_crm_dump.sql" ]; then
    BACKUP_NAME="vision_crm_dump.$(date +%Y%m%d_%H%M%S).sql"
    echo "📦 Backing up existing dump to: $BACKUP_NAME"
    mv vision_crm_dump.sql "$BACKUP_NAME"
fi

# Create new dump
echo ""
echo "💾 Creating database dump..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --add-drop-table \
    "$DB_NAME" > vision_crm_dump.sql 2>/dev/null

if [ $? -eq 0 ]; then
    FILE_SIZE=$(ls -lh vision_crm_dump.sql | awk '{print $5}')
    echo "   ✅ Dump created successfully! (Size: $FILE_SIZE)"
else
    echo "   ❌ Failed to create dump"
    exit 1
fi

# Show summary
echo ""
echo "📊 Dump Summary:"
TABLE_COUNT=$(grep -c "CREATE TABLE" vision_crm_dump.sql || echo "0")
echo "   Tables: $TABLE_COUNT"

RBAC_CHECK=$(grep -c "CREATE TABLE \`profiles\`" vision_crm_dump.sql || echo "0")
if [ "$RBAC_CHECK" -gt 0 ]; then
    echo "   ✅ RBAC tables included"
fi

echo ""
echo "✅ Database dump completed!"
echo ""
echo "📝 Next Steps:"
echo "   1. Review the dump file: vision_crm_dump.sql"
echo "   2. Commit to git if needed: git add database/vision_crm_dump.sql"
echo "   3. Test restoration: ./restore-db.sh"
echo ""
