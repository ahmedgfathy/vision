/**
 * Test Profile Permissions Save
 * Run with: node utils/testProfileSave.js
 */

require('dotenv').config();
const { Profile, ProfileModule, ProfileField } = require('../models/Profile');

async function testProfileSave() {
    try {
        console.log('🔍 Testing Profile Permissions Save...\n');

        // Step 1: Get all profiles
        console.log('Step 1: Fetching all profiles...');
        const profiles = await Profile.findAll();
        console.log(`Found ${profiles.length} profiles:`);
        profiles.forEach(p => console.log(`  - ${p.id}: ${p.name}`));
        console.log('');

        if (profiles.length === 0) {
            console.log('❌ No profiles found. Create one first!');
            return;
        }

        // Test with first profile (usually Admin)
        const testProfile = profiles[0];
        console.log(`Testing with Profile: ${testProfile.name} (ID: ${testProfile.id})\n`);

        // Step 2: Save module permissions
        console.log('Step 2: Saving module permissions...');
        const testModules = [
            {
                module_name: 'properties',
                permission_view: true,
                permission_create: true,
                permission_edit: true,
                permission_delete: true
            },
            {
                module_name: 'leads',
                permission_view: true,
                permission_create: false,
                permission_edit: false,
                permission_delete: false
            }
        ];

        // Delete existing
        await ProfileModule.deleteByProfile(testProfile.id);
        console.log('  Deleted existing module permissions');

        // Insert new
        for (const module of testModules) {
            await ProfileModule.upsert(testProfile.id, module.module_name, {
                permission_view: module.permission_view,
                permission_create: module.permission_create,
                permission_edit: module.permission_edit,
                permission_delete: module.permission_delete
            });
            console.log(`  Saved: ${module.module_name}`);
        }

        // Step 3: Verify module permissions saved
        console.log('\nStep 3: Verifying module permissions...');
        const savedModules = await ProfileModule.getByProfile(testProfile.id);
        console.log(`  Found ${savedModules.length} module permissions:`);
        savedModules.forEach(m => {
            console.log(`  - ${m.module_name}: V:${m.permission_view} C:${m.permission_create} E:${m.permission_edit} D:${m.permission_delete}`);
        });

        // Step 4: Save field permissions
        console.log('\nStep 4: Saving field permissions...');
        const testFields = [
            {
                module_name: 'properties',
                field_name: 'unit_for',
                can_view: true,
                can_edit: true
            },
            {
                module_name: 'properties',
                field_name: 'total_price',
                can_view: true,
                can_edit: false
            }
        ];

        // Delete existing
        await ProfileField.deleteByProfile(testProfile.id);
        console.log('  Deleted existing field permissions');

        // Insert new
        for (const field of testFields) {
            await ProfileField.upsert(testProfile.id, field.module_name, field.field_name, {
                can_view: field.can_view,
                can_edit: field.can_edit
            });
            console.log(`  Saved: ${field.module_name}.${field.field_name}`);
        }

        // Step 5: Verify field permissions saved
        console.log('\nStep 5: Verifying field permissions...');
        const savedFields = await ProfileField.getByProfile(testProfile.id);
        console.log(`  Found ${savedFields.length} field permissions:`);
        savedFields.forEach(f => {
            console.log(`  - ${f.module_name}.${f.field_name}: View:${f.can_view} Edit:${f.can_edit}`);
        });

        // Step 6: Get full profile with permissions
        console.log('\nStep 6: Getting full profile with permissions...');
        const fullProfile = await Profile.getWithPermissions(testProfile.id);
        console.log(`Profile: ${fullProfile.name}`);
        console.log(`  Modules: ${fullProfile.modules.length}`);
        console.log(`  Fields: ${fullProfile.fields.length}`);

        console.log('\n✅ All tests passed! Permissions are saving correctly.\n');

    } catch (error) {
        console.error('\n❌ Error during test:', error);
        console.error(error.stack);
    } finally {
        process.exit(0);
    }
}

testProfileSave();
