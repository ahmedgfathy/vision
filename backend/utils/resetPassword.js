/**
 * Utility to reset a user's password
 * Run with: node utils/resetPassword.js <email> <new_password>
 * Example: node utils/resetPassword.js admin@vision.com admin123
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function resetPassword(email, newPassword) {
    if (!email || !newPassword) {
        console.error('❌ Usage: node utils/resetPassword.js <email> <new_password>');
        console.error('   Example: node utils/resetPassword.js admin@vision.com admin123');
        process.exit(1);
    }

    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to database\n');

        // Check if user exists
        const [users] = await connection.execute(
            'SELECT id, username, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            console.error(`❌ User not found: ${email}`);
            console.log('\n💡 Available users:');

            const [allUsers] = await connection.execute(
                'SELECT email FROM users ORDER BY id'
            );
            allUsers.forEach(u => console.log(`   - ${u.email}`));

            process.exit(1);
        }

        const user = users[0];

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await connection.execute(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [hashedPassword, email]
        );

        console.log('✅ Password reset successful!\n');
        console.log('═══════════════════════════════════════════════════');
        console.log(`📧 Email:    ${user.email}`);
        console.log(`👤 Username: ${user.username || 'N/A'}`);
        console.log(`🔑 Password: ${newPassword}`);
        console.log('═══════════════════════════════════════════════════');
        console.log('\n✨ You can now login with these credentials\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Get arguments from command line
const args = process.argv.slice(2);
const email = args[0];
const newPassword = args[1];

resetPassword(email, newPassword);
