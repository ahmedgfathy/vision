/**
 * Utility to check existing users in the database
 * Run with: node utils/checkUsers.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUsers() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to database\n');

        // Get all users
        const [users] = await connection.execute(`
            SELECT 
                u.id,
                u.username,
                u.email,
                u.role_id,
                r.name as role_name,
                u.profile_id,
                p.name as profile_name,
                u.created_at
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN profiles p ON u.profile_id = p.id
            ORDER BY u.id
        `);

        console.log('📋 Users in database:\n');
        console.log('═══════════════════════════════════════════════════════════════════════════════');
        console.log('ID | Username      | Email                  | Role       | Profile');
        console.log('───────────────────────────────────────────────────────────────────────────────');
        
        users.forEach(user => {
            const id = String(user.id).padEnd(3);
            const username = String(user.username || 'N/A').padEnd(14);
            const email = String(user.email).padEnd(23);
            const role = String(user.role_name || 'N/A').padEnd(11);
            const profile = String(user.profile_name || 'None').padEnd(15);
            
            console.log(`${id}| ${username}| ${email}| ${role}| ${profile}`);
        });
        
        console.log('═══════════════════════════════════════════════════════════════════════════════');
        console.log(`\n📊 Total users: ${users.length}\n`);

        // Check for admin users specifically
        const [admins] = await connection.execute(`
            SELECT u.email, r.name as role 
            FROM users u 
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE r.name = 'admin' OR u.email LIKE '%admin%'
        `);

        if (admins.length > 0) {
            console.log('👑 Admin users found:');
            admins.forEach(admin => {
                console.log(`   - ${admin.email} (${admin.role})`);
            });
            console.log('');
        }

        console.log('💡 To reset a password, run:');
        console.log('   node utils/resetPassword.js <email> <new_password>');
        console.log('');
        console.log('   Example: node utils/resetPassword.js admin@vision.com admin123\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkUsers();
