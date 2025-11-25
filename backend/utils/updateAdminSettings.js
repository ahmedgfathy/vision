const mysql = require('mysql2/promise');
require('dotenv').config();

const updateAdminSettingsTables = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Updating dropdown tables for Admin Settings Module...');

        // Update property_types table
        await connection.query(`
      ALTER TABLE property_types 
      ADD COLUMN IF NOT EXISTS created_by_user_id INT,
      ADD COLUMN IF NOT EXISTS updated_by_user_id INT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      ADD FOREIGN KEY IF NOT EXISTS (created_by_user_id) REFERENCES users(id),
      ADD FOREIGN KEY IF NOT EXISTS (updated_by_user_id) REFERENCES users(id)
    `);
        console.log('✓ Updated property_types table');

        // Update property_status table
        await connection.query(`
      ALTER TABLE property_status 
      ADD COLUMN IF NOT EXISTS created_by_user_id INT,
      ADD COLUMN IF NOT EXISTS updated_by_user_id INT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      ADD FOREIGN KEY IF NOT EXISTS (created_by_user_id) REFERENCES users(id),
      ADD FOREIGN KEY IF NOT EXISTS (updated_by_user_id) REFERENCES users(id)
    `);
        console.log('✓ Updated property_status table');

        // Update listing_types table
        await connection.query(`
      ALTER TABLE listing_types 
      ADD COLUMN IF NOT EXISTS created_by_user_id INT,
      ADD COLUMN IF NOT EXISTS updated_by_user_id INT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      ADD FOREIGN KEY IF NOT EXISTS (created_by_user_id) REFERENCES users(id),
      ADD FOREIGN KEY IF NOT EXISTS (updated_by_user_id) REFERENCES users(id)
    `);
        console.log('✓ Updated listing_types table');

        // Create admin dropdown permissions
        const adminPermissions = [
            { name: 'admin.dropdown.view', resource: 'admin.dropdown', action: 'view', description: 'View dropdown settings' },
            { name: 'admin.dropdown.create', resource: 'admin.dropdown', action: 'create', description: 'Create dropdown items' },
            { name: 'admin.dropdown.update', resource: 'admin.dropdown', action: 'update', description: 'Update dropdown items' },
            { name: 'admin.dropdown.delete', resource: 'admin.dropdown', action: 'delete', description: 'Delete dropdown items' }
        ];

        for (const perm of adminPermissions) {
            await connection.query(
                'INSERT IGNORE INTO permissions (name, resource, action, description) VALUES (?, ?, ?, ?)',
                [perm.name, perm.resource, perm.action, perm.description]
            );
        }
        console.log('✓ Created admin dropdown permissions');

        // Assign admin dropdown permissions to admin role
        const [adminRole] = await connection.query('SELECT id FROM roles WHERE name = ?', ['admin']);
        if (adminRole.length > 0) {
            const [adminDropdownPerms] = await connection.query(
                'SELECT id FROM permissions WHERE resource = ?',
                ['admin.dropdown']
            );

            for (const perm of adminDropdownPerms) {
                await connection.query(
                    'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
                    [adminRole[0].id, perm.id]
                );
            }
            console.log('✓ Assigned admin dropdown permissions to admin role');
        }

        console.log('\n✅ Admin Settings database migration completed successfully!');

    } catch (error) {
        console.error('❌ Error updating Admin Settings tables:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

updateAdminSettingsTables();
