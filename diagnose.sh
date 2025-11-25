#!/bin/bash
# Complete Diagnostic Script for Vision CRM
# Run with: bash diagnose.sh

echo "🔍 Vision CRM Complete Diagnostic"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js version
echo "📋 Step 1: Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node.js: $NODE_VERSION"

if [[ "$NODE_VERSION" < "v20" ]]; then
    echo -e "   ${RED}❌ Node.js $NODE_VERSION is too old. Need v20.19+ or v22+${NC}"
    echo "   Run: nvm install 22 && nvm use 22"
else
    echo -e "   ${GREEN}✅ Node.js version is compatible${NC}"
fi
echo ""

# Step 2: Check MySQL
echo "📋 Step 2: Checking MySQL..."
if command -v mysql &> /dev/null; then
    echo -e "   ${GREEN}✅ MySQL client installed${NC}"
    
    # Check if MySQL is running
    if pgrep -x mysqld > /dev/null; then
        echo -e "   ${GREEN}✅ MySQL server is running${NC}"
    else
        echo -e "   ${RED}❌ MySQL server is NOT running${NC}"
        echo "   Start it with: sudo service mysql start"
    fi
else
    echo -e "   ${RED}❌ MySQL is not installed${NC}"
fi
echo ""

# Step 3: Check backend .env
echo "📋 Step 3: Checking backend .env file..."
if [ -f "backend/.env" ]; then
    echo -e "   ${GREEN}✅ .env file exists${NC}"
    echo ""
    echo "   Current configuration:"
    grep -E "^(DB_HOST|DB_USER|DB_NAME|PORT)" backend/.env | while read line; do
        if [[ $line == *"DB_PASS"* ]]; then
            echo "   DB_PASS=***hidden***"
        else
            echo "   $line"
        fi
    done
else
    echo -e "   ${RED}❌ .env file NOT found${NC}"
    echo "   Create it: cp backend/.env.example backend/.env"
fi
echo ""

# Step 4: Test MySQL connection
echo "📋 Step 4: Testing MySQL connection..."
if [ -f "backend/.env" ]; then
    # Source the .env file
    export $(grep -v '^#' backend/.env | xargs)
    
    # Test connection
    mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✅ MySQL connection successful${NC}"
        
        # Check if database exists
        DB_EXISTS=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" -e "SHOW DATABASES LIKE '$DB_NAME'" 2>/dev/null | grep -c "$DB_NAME")
        
        if [ $DB_EXISTS -eq 1 ]; then
            echo -e "   ${GREEN}✅ Database '$DB_NAME' exists${NC}"
            
            # Check users table
            TABLE_COUNT=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES LIKE 'users'" 2>/dev/null | grep -c "users")
            
            if [ $TABLE_COUNT -eq 1 ]; then
                echo -e "   ${GREEN}✅ Users table exists${NC}"
                
                # Count users
                USER_COUNT=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) FROM users" 2>/dev/null | tail -n 1)
                echo "   Found $USER_COUNT user(s)"
            else
                echo -e "   ${RED}❌ Users table NOT found${NC}"
                echo "   Restore database: cd database && mysql -u root -p vision_crm < vision_crm_dump.sql"
            fi
        else
            echo -e "   ${RED}❌ Database '$DB_NAME' does NOT exist${NC}"
            echo "   Create it: mysql -u root -p -e \"CREATE DATABASE $DB_NAME;\""
        fi
    else
        echo -e "   ${RED}❌ MySQL connection FAILED${NC}"
        echo "   Check credentials in backend/.env"
    fi
else
    echo -e "   ${YELLOW}⚠️  Skipping (no .env file)${NC}"
fi
echo ""

# Step 5: Check if backend is running
echo "📋 Step 5: Checking if backend is running..."
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Backend is running on port 3000${NC}"
    RESPONSE=$(curl -s http://localhost:3000/)
    echo "   Response: $RESPONSE"
else
    echo -e "   ${RED}❌ Backend is NOT running on port 3000${NC}"
    echo "   Start it with: cd backend && npm run dev"
fi
echo ""

# Step 6: Check if frontend is running
echo "📋 Step 6: Checking if frontend is running..."
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Frontend is running on port 5173${NC}"
else
    echo -e "   ${RED}❌ Frontend is NOT running on port 5173${NC}"
    echo "   Start it with: npm run dev"
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════════"
echo "📊 SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check what needs to be done
ISSUES=0

# Check Node
if [[ "$NODE_VERSION" < "v20" ]]; then
    echo -e "${RED}❌ Upgrade Node.js to v20+ or v22+${NC}"
    ISSUES=$((ISSUES+1))
fi

# Check MySQL running
if ! pgrep -x mysqld > /dev/null; then
    echo -e "${RED}❌ Start MySQL: sudo service mysql start${NC}"
    ISSUES=$((ISSUES+1))
fi

# Check .env
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ Create backend/.env file${NC}"
    ISSUES=$((ISSUES+1))
fi

# Check backend running
if ! curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo -e "${RED}❌ Start backend: cd backend && npm run dev${NC}"
    ISSUES=$((ISSUES+1))
fi

# Check frontend running
if ! curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo -e "${RED}❌ Start frontend: npm run dev${NC}"
    ISSUES=$((ISSUES+1))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Everything looks good! Try logging in now.${NC}"
else
    echo -e "${YELLOW}⚠️  Found $ISSUES issue(s) to fix above${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
