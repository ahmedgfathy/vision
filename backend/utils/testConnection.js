/**
 * Database Connection Tester
 * Run with: node utils/testConnection.js
 * 
 * This will test:
 * 1. If .env file exists and has required variables
 * 2. MySQL connection
 * 3. Database exists
 * 4. Required tables exist
 * 5. Users table has data
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function testConnection() {
    console.log('🔍 Testing Database Connection...\n');
    console.log('═══════════════════════════════════════════════════════════════');

    // Step 1: Check .env file
    console.log('\n📋 Step 1: Checking .env configuration...');
    const envPath = path.join(__dirname, '..', '.env');

    if (!fs.existsSync(envPath)) {
        console.log('❌ .env file not found!');
        console.log('   Create it by copying .env.example:');
        console.log('   cp .env.example .env');
        return;
    }

    console.log('✅ .env file exists');

    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
    const missing = [];

    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        } else {
            const value = varName === 'DB_PASS'
                ? '***hidden***'
                : process.env[varName];
            console.log(`   ${varName}: ${value}`);
        }
    });

    if (missing.length > 0) {
        console.log(`❌ Missing variables: ${missing.join(', ')}`);
        console.log('   Please add them to your .env file');
        return;
    }

    // Step 2: Test MySQL connection
    console.log('\n📋 Step 2: Testing MySQL connection...');
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });
        console.log('✅ MySQL server is reachable');
    } catch (error) {
        console.log('❌ Cannot connect to MySQL server');
        console.log(`   Error: ${error.message}`);
        console.log('\n💡 Possible solutions:');
        console.log('   1. Check MySQL is running: sudo service mysql status');
        console.log('   2. Start MySQL: sudo service mysql start');
        console.log('   3. Check credentials in .env file');
        console.log(`   4. Test manually: mysql -u ${process.env.DB_USER} -p -h ${process.env.DB_HOST}`);
        return;
    }

    // Step 3: Check database exists
    console.log('\n📋 Step 3: Checking database exists...');

    try {
        const [databases] = await connection.query(
            `SHOW DATABASES LIKE '${process.env.DB_NAME}'`
        );

        if (databases.length === 0) {
            console.log(`❌ Database '${process.env.DB_NAME}' does not exist`);
            console.log('\n💡 Create it with:');
            console.log(`   mysql -u root -p -e "CREATE DATABASE ${process.env.DB_NAME};"`);
            console.log('   OR restore from dump:');
            console.log('   cd database && ./restore-db.sh');
            await connection.end();
            return;
        }

        console.log(`✅ Database '${process.env.DB_NAME}' exists`);
    } catch (error) {
        console.log('❌ Error checking database:', error.message);
        await connection.end();
        return;
    }

    // Switch to the database
    await connection.changeUser({ database: process.env.DB_NAME });

    // Step 4: Check required tables
    console.log('\n📋 Step 4: Checking required tables...');

    const requiredTables = ['users', 'roles', 'properties', 'profiles', 'profile_modules'];
    const [tables] = await connection.query('SHOW TABLES');
    const existingTables = tables.map(t => Object.values(t)[0]);

    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
        console.log('❌ Missing tables:', missingTables.join(', '));
        console.log('\n💡 Restore database:');
        console.log('   cd database && ./restore-db.sh');
        await connection.end();
        return;
    }

    console.log('✅ All required tables exist');
    console.log(`   Total tables: ${existingTables.length}`);

    // Step 5: Check users table
    console.log('\n📋 Step 5: Checking users...');

    try {
        const [users] = await connection.query(
            'SELECT COUNT(*) as count FROM users'
        );

        if (users[0].count === 0) {
            console.log('❌ No users found in database');
            console.log('   Restore database from dump');
        } else {
            console.log(`✅ Found ${users[0].count} user(s)`);

            // Show admin users
            const [admins] = await connection.query(`
                SELECT u.id, u.email, r.name as role 
                FROM users u 
                LEFT JOIN roles r ON u.role_id = r.id 
                WHERE r.name = 'admin' OR u.email LIKE '%admin%'
                LIMIT 5
            `);

            if (admins.length > 0) {
                console.log('\n   Admin users:');
                admins.forEach(admin => {
                    console.log(`   - ${admin.email} (${admin.role})`);
                });
            }
        }
    } catch (error) {
        console.log('❌ Error checking users:', error.message);
    }

    // Step 6: Test a sample query
    console.log('\n📋 Step 6: Testing sample query...');

    try {
        const [result] = await connection.query('SELECT 1 + 1 AS result');
        console.log('✅ Database queries working');
    } catch (error) {
        console.log('❌ Query failed:', error.message);
    }

    await connection.end();

    // Final summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ DATABASE CONNECTION TEST PASSED!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n💡 Next steps:');
    console.log('   1. Start backend: npm run dev');
    console.log('   2. Check users: node utils/checkUsers.js');
    console.log('   3. Reset password: node utils/resetPassword.js <email> <password>');
    console.log('');
}

// Run the test
testConnection().catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
});
