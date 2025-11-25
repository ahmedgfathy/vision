const mysql = require('mysql2/promise');
require('dotenv').config();

const migratePropertiesTable = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Migrating properties table to add missing columns...');

        // Get current columns
        const [columns] = await connection.query('DESCRIBE properties');
        const existingColumns = columns.map(col => col.Field);
        console.log('Existing columns:', existingColumns.join(', '));

        // Define all required columns
        const requiredColumns = [
            { name: 'reference_number', sql: 'ADD COLUMN reference_number VARCHAR(50) UNIQUE' },
            { name: 'description', sql: 'ADD COLUMN description TEXT' },
            { name: 'type_id', sql: 'ADD COLUMN type_id INT' },
            { name: 'status_id', sql: 'ADD COLUMN status_id INT' },
            { name: 'listing_type_id', sql: 'ADD COLUMN listing_type_id INT' },
            { name: 'area', sql: 'ADD COLUMN area DECIMAL(10, 2)' },
            { name: 'property_owner_phone', sql: 'ADD COLUMN property_owner_phone VARCHAR(20)' },
            { name: 'assigned_to_user_id', sql: 'ADD COLUMN assigned_to_user_id INT' },
            { name: 'bedrooms', sql: 'ADD COLUMN bedrooms INT' },
            { name: 'bathrooms', sql: 'ADD COLUMN bathrooms INT' },
            { name: 'parking_spaces', sql: 'ADD COLUMN parking_spaces INT' },
            { name: 'year_built', sql: 'ADD COLUMN year_built INT' },
            { name: 'floor_number', sql: 'ADD COLUMN floor_number INT' },
            { name: 'total_floors', sql: 'ADD COLUMN total_floors INT' },
            { name: 'furnished', sql: 'ADD COLUMN furnished BOOLEAN DEFAULT false' },
            { name: 'has_pool', sql: 'ADD COLUMN has_pool BOOLEAN DEFAULT false' },
            { name: 'has_gym', sql: 'ADD COLUMN has_gym BOOLEAN DEFAULT false' },
            { name: 'has_security', sql: 'ADD COLUMN has_security BOOLEAN DEFAULT false' },
            { name: 'has_parking', sql: 'ADD COLUMN has_parking BOOLEAN DEFAULT false' },
            { name: 'has_garden', sql: 'ADD COLUMN has_garden BOOLEAN DEFAULT false' },
            { name: 'has_balcony', sql: 'ADD COLUMN has_balcony BOOLEAN DEFAULT false' },
            { name: 'has_elevator', sql: 'ADD COLUMN has_elevator BOOLEAN DEFAULT false' },
            { name: 'has_ac', sql: 'ADD COLUMN has_ac BOOLEAN DEFAULT false' },
            { name: 'has_heating', sql: 'ADD COLUMN has_heating BOOLEAN DEFAULT false' },
            { name: 'has_internet', sql: 'ADD COLUMN has_internet BOOLEAN DEFAULT false' },
            { name: 'pets_allowed', sql: 'ADD COLUMN pets_allowed BOOLEAN DEFAULT false' },
            { name: 'city', sql: 'ADD COLUMN city VARCHAR(100)' },
            { name: 'notes', sql: 'ADD COLUMN notes TEXT' },
            { name: 'updated_at', sql: 'ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
            { name: 'created_by_user_id', sql: 'ADD COLUMN created_by_user_id INT' },
            { name: 'updated_by_user_id', sql: 'ADD COLUMN updated_by_user_id INT' }
        ];

        // Add missing columns
        for (const col of requiredColumns) {
            if (!existingColumns.includes(col.name)) {
                await connection.query(`ALTER TABLE properties ${col.sql}`);
                console.log(`✓ Added column: ${col.name}`);
            } else {
                console.log(`- Column already exists: ${col.name}`);
            }
        }

        // Add foreign keys if they don't exist
        console.log('\nAdding foreign key constraints...');

        const foreignKeys = [
            { name: 'fk_properties_type', sql: 'ADD CONSTRAINT fk_properties_type FOREIGN KEY (type_id) REFERENCES property_types(id)' },
            { name: 'fk_properties_status', sql: 'ADD CONSTRAINT fk_properties_status FOREIGN KEY (status_id) REFERENCES property_status(id)' },
            { name: 'fk_properties_listing_type', sql: 'ADD CONSTRAINT fk_properties_listing_type FOREIGN KEY (listing_type_id) REFERENCES listing_types(id)' },
            { name: 'fk_properties_assigned_user', sql: 'ADD CONSTRAINT fk_properties_assigned_user FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)' },
            { name: 'fk_properties_created_by', sql: 'ADD CONSTRAINT fk_properties_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id)' },
            { name: 'fk_properties_updated_by', sql: 'ADD CONSTRAINT fk_properties_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES users(id)' }
        ];

        for (const fk of foreignKeys) {
            try {
                await connection.query(`ALTER TABLE properties ${fk.sql}`);
                console.log(`✓ Added foreign key: ${fk.name}`);
            } catch (error) {
                if (error.code === 'ER_DUP_KEYNAME') {
                    console.log(`- Foreign key already exists: ${fk.name}`);
                } else {
                    console.log(`⚠ Could not add foreign key ${fk.name}: ${error.message}`);
                }
            }
        }

        console.log('\n✅ Properties table migration completed successfully!');

    } catch (error) {
        console.error('❌ Error migrating properties table:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

migratePropertiesTable();
