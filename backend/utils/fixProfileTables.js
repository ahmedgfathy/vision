/**
 * Fix Profile Tables Schema
 * Adds missing unique constraints needed for ON DUPLICATE KEY UPDATE to work
 * Run with: node utils/fixProfileTables.js
 */

require('dotenv').config();
const db = require('../config/db');

async function fixSchema() {
    try {
        console.log('🔧 Fixing Profile Tables Schema...\n');

        // Fix profile_modules table
        console.log('Step 1: Fixing profile_modules table...');
        try {
            await db.execute(`
                ALTER TABLE profile_modules 
                ADD UNIQUE KEY unique_profile_module (profile_id, module_name)
            `);
            console.log('✅ Added UNIQUE KEY to profile_modules (profile_id, module_name)');
        } catch (error) {
            if (error.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️  UNIQUE KEY already exists on profile_modules');
            } else {
                throw error;
            }
        }

        // Fix profile_fields table
        console.log('\nStep 2: Fixing profile_fields table...');
        try {
            await db.execute(`
                ALTER TABLE profile_fields 
                ADD UNIQUE KEY unique_profile_field (profile_id, module_name, field_name)
            `);
            console.log('✅ Added UNIQUE KEY to profile_fields (profile_id, module_name, field_name)');
        } catch (error) {
            if (error.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️  UNIQUE KEY already exists on profile_fields');
            } else {
                throw error;
            }
        }

        console.log('\n✅ Schema fixes applied successfully!');
        console.log('\n💡 Now ON DUPLICATE KEY UPDATE will work correctly.');
        console.log('   You can modify profile permissions and they will save properly.\n');

    } catch (error) {
        console.error('\n❌ Error fixing schema:', error);
        console.error(error.stack);
    } finally {
        process.exit(0);
    }
}

fixSchema();
