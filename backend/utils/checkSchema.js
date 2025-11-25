/**
 * Check Database Schema for Profile Tables
 * Run with: node utils/checkSchema.js
 */

require('dotenv').config();
const db = require('../config/db');

async function checkSchema() {
    try {
        console.log('🔍 Checking Profile Tables Schema...\n');

        // Check profiles table
        console.log('═══════════════════════════════════════');
        console.log('TABLE: profiles');
        console.log('═══════════════════════════════════════');
        const [profilesSchema] = await db.execute('DESCRIBE profiles');
        profilesSchema.forEach(col => {
            console.log(`${col.Field.padEnd(20)} ${col.Type.padEnd(20)} ${col.Key.padEnd(5)} ${col.Null}`);
        });

        const [profilesIndexes] = await db.execute('SHOW INDEX FROM profiles');
        console.log('\nIndexes:');
        profilesIndexes.forEach(idx => {
            console.log(`  ${idx.Key_name}: ${idx.Column_name} (${idx.Non_unique ? 'non-unique' : 'unique'})`);
        });

        // Check profile_modules table
        console.log('\n═══════════════════════════════════════');
        console.log('TABLE: profile_modules');
        console.log('═══════════════════════════════════════');
        const [modulesSchema] = await db.execute('DESCRIBE profile_modules');
        modulesSchema.forEach(col => {
            console.log(`${col.Field.padEnd(20)} ${col.Type.padEnd(20)} ${col.Key.padEnd(5)} ${col.Null}`);
        });

        const [modulesIndexes] = await db.execute('SHOW INDEX FROM profile_modules');
        console.log('\nIndexes:');
        modulesIndexes.forEach(idx => {
            console.log(`  ${idx.Key_name}: ${idx.Column_name} (${idx.Non_unique ? 'non-unique' : 'unique'})`);
        });

        // Check profile_fields table
        console.log('\n═══════════════════════════════════════');
        console.log('TABLE: profile_fields');
        console.log('═══════════════════════════════════════');
        const [fieldsSchema] = await db.execute('DESCRIBE profile_fields');
        fieldsSchema.forEach(col => {
            console.log(`${col.Field.padEnd(20)} ${col.Type.padEnd(20)} ${col.Key.padEnd(5)} ${col.Null}`);
        });

        const [fieldsIndexes] = await db.execute('SHOW INDEX FROM profile_fields');
        console.log('\nIndexes:');
        fieldsIndexes.forEach(idx => {
            console.log(`  ${idx.Key_name}: ${idx.Column_name} (${idx.Non_unique ? 'non-unique' : 'unique'})`);
        });

        // Check for required unique keys
        console.log('\n═══════════════════════════════════════');
        console.log('VALIDATION');
        console.log('═══════════════════════════════════════');

        // Check profile_modules unique key
        const hasModulesUniqueKey = modulesIndexes.some(idx =>
            !idx.Non_unique && idx.Key_name !== 'PRIMARY' &&
            (idx.Column_name === 'profile_id' || idx.Column_name === 'module_name')
        );

        if (!hasModulesUniqueKey) {
            console.log('❌ profile_modules missing UNIQUE KEY on (profile_id, module_name)');
            console.log('   ON DUPLICATE KEY UPDATE will not work correctly!\n');
            console.log('   Fix with:');
            console.log('   ALTER TABLE profile_modules ADD UNIQUE KEY unique_profile_module (profile_id, module_name);');
        } else {
            console.log('✅ profile_modules has proper unique constraint');
        }

        // Check profile_fields unique key
        const hasFieldsUniqueKey = fieldsIndexes.some(idx =>
            !idx.Non_unique && idx.Key_name !== 'PRIMARY' &&
            (idx.Column_name === 'profile_id' || idx.Column_name === 'module_name' || idx.Column_name === 'field_name')
        );

        if (!hasFieldsUniqueKey) {
            console.log('❌ profile_fields missing UNIQUE KEY on (profile_id, module_name, field_name)');
            console.log('   ON DUPLICATE KEY UPDATE will not work correctly!\n');
            console.log('   Fix with:');
            console.log('   ALTER TABLE profile_fields ADD UNIQUE KEY unique_profile_field (profile_id, module_name, field_name);');
        } else {
            console.log('✅ profile_fields has proper unique constraint');
        }

        console.log('');

    } catch (error) {
        console.error('❌ Error checking schema:', error);
    } finally {
        process.exit(0);
    }
}

checkSchema();
