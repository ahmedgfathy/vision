const mysql = require('mysql2/promise');
require('dotenv').config();

const initPropertiesDatabase = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Initializing Properties Module tables...');

        // Create property_types table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS property_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✓ Created property_types table');

        // Create property_status table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS property_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✓ Created property_status table');

        // Create listing_types table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS listing_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✓ Created listing_types table');

        // Create properties table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        reference_number VARCHAR(50) UNIQUE,
        description TEXT,
        type_id INT,
        status_id INT,
        listing_type_id INT,
        price DECIMAL(15, 2),
        area DECIMAL(10, 2),
        property_owner_phone VARCHAR(20),
        assigned_to_user_id INT,
        bedrooms INT,
        bathrooms INT,
        parking_spaces INT,
        year_built INT,
        floor_number INT,
        total_floors INT,
        furnished BOOLEAN DEFAULT false,
        has_pool BOOLEAN DEFAULT false,
        has_gym BOOLEAN DEFAULT false,
        has_security BOOLEAN DEFAULT false,
        has_parking BOOLEAN DEFAULT false,
        has_garden BOOLEAN DEFAULT false,
        has_balcony BOOLEAN DEFAULT false,
        has_elevator BOOLEAN DEFAULT false,
        has_ac BOOLEAN DEFAULT false,
        has_heating BOOLEAN DEFAULT false,
        has_internet BOOLEAN DEFAULT false,
        pets_allowed BOOLEAN DEFAULT false,
        address TEXT,
        city VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by_user_id INT,
        updated_by_user_id INT,
        FOREIGN KEY (type_id) REFERENCES property_types(id),
        FOREIGN KEY (status_id) REFERENCES property_status(id),
        FOREIGN KEY (listing_type_id) REFERENCES listing_types(id),
        FOREIGN KEY (assigned_to_user_id) REFERENCES users(id),
        FOREIGN KEY (created_by_user_id) REFERENCES users(id),
        FOREIGN KEY (updated_by_user_id) REFERENCES users(id)
      )
    `);
        console.log('✓ Created properties table');

        // Create property_media table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS property_media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type ENUM('image', 'video') NOT NULL,
        file_size INT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);
        console.log('✓ Created property_media table');

        // Create audit_logs table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        table_name VARCHAR(100) NOT NULL,
        record_id INT NOT NULL,
        action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
        old_values JSON,
        new_values JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
        console.log('✓ Created audit_logs table');

        // Seed property_types
        const propertyTypes = [
            'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio',
            'Office', 'Shop', 'Warehouse', 'Land', 'Building'
        ];

        for (const type of propertyTypes) {
            await connection.query(
                'INSERT IGNORE INTO property_types (name) VALUES (?)',
                [type]
            );
        }
        console.log('✓ Seeded property_types');

        // Seed property_status
        const propertyStatuses = [
            'Available', 'Sold', 'Rented', 'Reserved', 'Off Market', 'Under Maintenance'
        ];

        for (const status of propertyStatuses) {
            await connection.query(
                'INSERT IGNORE INTO property_status (name) VALUES (?)',
                [status]
            );
        }
        console.log('✓ Seeded property_status');

        // Seed listing_types
        const listingTypes = ['Sale', 'Rent', 'Lease'];

        for (const listingType of listingTypes) {
            await connection.query(
                'INSERT IGNORE INTO listing_types (name) VALUES (?)',
                [listingType]
            );
        }
        console.log('✓ Seeded listing_types');

        // Add properties permissions
        const permissions = [
            { name: 'properties.view', resource: 'properties', action: 'view', description: 'View properties' },
            { name: 'properties.create', resource: 'properties', action: 'create', description: 'Create properties' },
            { name: 'properties.update', resource: 'properties', action: 'update', description: 'Update properties' },
            { name: 'properties.delete', resource: 'properties', action: 'delete', description: 'Delete properties' }
        ];

        for (const perm of permissions) {
            await connection.query(
                'INSERT IGNORE INTO permissions (name, resource, action, description) VALUES (?, ?, ?, ?)',
                [perm.name, perm.resource, perm.action, perm.description]
            );
        }
        console.log('✓ Added properties permissions');

        // Assign all properties permissions to admin role
        const [adminRole] = await connection.query('SELECT id FROM roles WHERE name = ?', ['admin']);
        if (adminRole.length > 0) {
            const [propertyPerms] = await connection.query(
                'SELECT id FROM permissions WHERE resource = ?',
                ['properties']
            );

            for (const perm of propertyPerms) {
                await connection.query(
                    'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
                    [adminRole[0].id, perm.id]
                );
            }
            console.log('✓ Assigned properties permissions to admin role');
        }

        console.log('\n✅ Properties Module database initialized successfully!');

    } catch (error) {
        console.error('❌ Error initializing Properties Module database:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

initPropertiesDatabase();
