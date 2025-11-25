#!/bin/bash
# Database Backup Script
# This script creates a complete backup of the vision_crm database

echo "🗄️  Creating database backup..."
echo ""

# Set variables
DB_NAME="vision_crm"
BACKUP_DIR="database"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LATEST_FILE="${BACKUP_DIR}/vision_crm_latest.sql"
TIMESTAMPED_FILE="${BACKUP_DIR}/vision_crm_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Dump database
echo "📥 Exporting database: ${DB_NAME}"
mysqldump -u root -p${DB_PASS} \
  --databases ${DB_NAME} \
  --add-drop-database \
  --routines \
  --triggers \
  --events \
  --single-transaction \
  --set-gtid-purged=OFF \
  > ${LATEST_FILE}

if [ $? -eq 0 ]; then
    echo "✅ Database exported to: ${LATEST_FILE}"
    
    # Also create a timestamped backup
    cp ${LATEST_FILE} ${TIMESTAMPED_FILE}
    echo "✅ Timestamped backup created: ${TIMESTAMPED_FILE}"
    
    # Show file size
    SIZE=$(du -h ${LATEST_FILE} | cut -f1)
    echo ""
    echo "📊 Backup size: ${SIZE}"
    
    # Show what's included
    echo ""
    echo "📋 Backup includes:"
    echo "   - Database schema"
    echo "   - All data"
    echo "   - Stored procedures/functions"
    echo "   - Triggers"
    echo "   - Events"
    echo ""
    echo "✅ Ready to commit to Git!"
else
    echo "❌ Error creating backup"
    exit 1
fi
