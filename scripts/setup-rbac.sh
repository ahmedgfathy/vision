#!/bin/bash

echo "🚀 Vision CRM - RBAC System Setup"
echo "=================================="
echo ""

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

echo ""
echo "🗄️  Step 2: Running database migration..."
cd backend
node utils/runMigration.js
if [ $? -ne 0 ]; then
    echo "❌ Migration failed. Please check your database configuration in .env"
    exit 1
fi

echo ""
echo "🌱 Step 3: Seeding default profiles..."
node utils/seedProfiles.js
if [ $? -ne 0 ]; then
    echo "❌ Seeding failed."
    exit 1
fi

echo ""
echo "✅ RBAC System Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Assign profiles to users:"
echo "      UPDATE users SET profile_id = 1 WHERE email = 'admin@vision.com';"
echo ""
echo "   2. Start the backend server:"
echo "      cd backend && npm start"
echo ""
echo "   3. Access Profile Management:"
echo "      Navigate to: Dashboard → Profiles & Permissions"
echo ""
echo "📖 For detailed documentation, see: RBAC_DOCUMENTATION.md"
echo ""
