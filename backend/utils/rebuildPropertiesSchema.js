const mysql = require('mysql2/promise');
require('dotenv').config();

const rebuildPropertiesSchema = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('🔄 Starting Properties Module Complete Redesign...\n');

        // ============================================
        // STEP 1: Drop Old Tables
        // ============================================
        console.log('📦 Step 1: Dropping old tables...');

        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const oldTables = [
            'property_media',
            'properties',
            'property_types',
            'property_status',
            'listing_types'
        ];

        for (const table of oldTables) {
            try {
                await connection.query(`DROP TABLE IF EXISTS ${table}`);
                console.log(`  ✓ Dropped: ${table}`);
            } catch (err) {
                console.log(`  - ${table} didn't exist`);
            }
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('');

        // ============================================
        // STEP 2: Create dynamic_lists Table
        // ============================================
        console.log('📦 Step 2: Creating dynamic_lists table...');

        await connection.query(`
      CREATE TABLE dynamic_lists (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category VARCHAR(50) NOT NULL,
        value VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_active (active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('  ✓ Created: dynamic_lists\n');

        // ============================================
        // STEP 3: Create properties Table
        // ============================================
        console.log('📦 Step 3: Creating properties table...');

        await connection.query(`
      CREATE TABLE properties (
        id INT PRIMARY KEY AUTO_INCREMENT,
        unit_for ENUM('For Rent', 'For Sale', 'Sold Out', 'Recycle') NOT NULL,
        area_id INT,
        unit_license ENUM('Administrative', 'Commercial', 'Medical', 'Factory'),
        mall_id INT,
        community_id INT,
        type_id INT,
        finished ENUM('Semi Finished', 'Fully Finished', 'Furnished', 'Concrete'),
        building VARCHAR(255),
        total_price DECIMAL(15, 2),
        more_units BOOLEAN DEFAULT false,
        unit_no VARCHAR(100),
        description TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_by_user_id INT,
        updated_by_user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (area_id) REFERENCES dynamic_lists(id) ON DELETE SET NULL,
        FOREIGN KEY (mall_id) REFERENCES dynamic_lists(id) ON DELETE SET NULL,
        FOREIGN KEY (community_id) REFERENCES dynamic_lists(id) ON DELETE SET NULL,
        FOREIGN KEY (type_id) REFERENCES dynamic_lists(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
        
        INDEX idx_unit_for (unit_for),
        INDEX idx_area (area_id),
        INDEX idx_type (type_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('  ✓ Created: properties\n');

        // ============================================
        // STEP 4: Create owner_info Table
        // ============================================
        console.log('📦 Step 4: Creating owner_info table...');

        await connection.query(`
      CREATE TABLE owner_info (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        offered_by ENUM('Owner', 'Owner Representative', 'Broker', 'Guard') NOT NULL,
        update_state ENUM('Want Update', 'Is Updated', 'Hidden') DEFAULT 'Want Update',
        owner_name VARCHAR(255) NOT NULL,
        update_by INT,
        mobile VARCHAR(20),
        last_follow_in DATE,
        tel VARCHAR(20),
        call_update ENUM('Answered', 'No Answer', 'Not Available'),
        call_note TEXT,
        new_feedback ENUM('Done', 'Under Follow Up', 'Unknown', 'Need Follow') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (update_by) REFERENCES users(id) ON DELETE SET NULL,
        
        INDEX idx_property (property_id),
        INDEX idx_feedback (new_feedback)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('  ✓ Created: owner_info\n');

        // ============================================
        // STEP 5: Create update_info Table
        // ============================================
        console.log('📦 Step 5: Creating update_info table...');

        await connection.query(`
      CREATE TABLE update_info (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        reminder_time TIME,
        rent_to DATE,
        reminder_date DATE,
        repeated_statement ENUM('Repeated', 'Not Repeated', 'Unknown'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        
        INDEX idx_property (property_id),
        INDEX idx_reminder_date (reminder_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('  ✓ Created: update_info\n');

        // ============================================
        // STEP 6: Create more_info Table
        // ============================================
        console.log('📦 Step 6: Creating more_info table...');

        await connection.query(`
      CREATE TABLE more_info (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        property_name VARCHAR(255) NOT NULL,
        handler_id INT,
        phase_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (handler_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (phase_id) REFERENCES dynamic_lists(id) ON DELETE SET NULL,
        
        INDEX idx_property (property_id),
        INDEX idx_handler (handler_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('  ✓ Created: more_info\n');

        // ============================================
        // STEP 7: Create property_gallery Table
        // ============================================
        console.log('📦 Step 7: Creating property_gallery table...');

        await connection.query(`
      CREATE TABLE property_gallery (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type ENUM('image', 'document') DEFAULT 'image',
        is_primary BOOLEAN DEFAULT false,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        
        INDEX idx_property (property_id),
        INDEX idx_primary (is_primary)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('  ✓ Created: property_gallery\n');

        // ============================================
        // STEP 8: Seed dynamic_lists with defaults
        // ============================================
        console.log('📦 Step 8: Seeding dynamic_lists with default values...');

        const seedData = [
            // Areas
            { category: 'area', value: 'New Cairo', order: 1 },
            { category: 'area', value: '6th October', order: 2 },
            { category: 'area', value: 'Zamalek', order: 3 },
            { category: 'area', value: 'Maadi', order: 4 },
            { category: 'area', value: 'Nasr City', order: 5 },

            // Malls
            { category: 'mall', value: 'Cairo Festival City', order: 1 },
            { category: 'mall', value: 'City Stars', order: 2 },
            { category: 'mall', value: 'Mall of Arabia', order: 3 },
            { category: 'mall', value: 'City Centre Almaza', order: 4 },

            // Communities
            { category: 'community', value: 'Rehab City', order: 1 },
            { category: 'community', value: 'Madinaty', order: 2 },
            { category: 'community', value: 'Palm Hills', order: 3 },
            { category: 'community', value: 'New Giza', order: 4 },

            // Property Types
            { category: 'type', value: 'Apartment', order: 1 },
            { category: 'type', value: 'Villa', order: 2 },
            { category: 'type', value: 'Office', order: 3 },
            { category: 'type', value: 'Shop', order: 4 },
            { category: 'type', value: 'Warehouse', order: 5 },

            // Phases
            { category: 'phase', value: 'Phase 1', order: 1 },
            { category: 'phase', value: 'Phase 2', order: 2 },
            { category: 'phase', value: 'Phase 3', order: 3 }
        ];

        for (const item of seedData) {
            await connection.query(
                'INSERT INTO dynamic_lists (category, value, display_order) VALUES (?, ?, ?)',
                [item.category, item.value, item.order]
            );
        }
        console.log(`  ✓ Inserted ${seedData.length} default dropdown values\n`);

        console.log('✅ Database Schema Redesign Complete!\n');
        console.log('Summary:');
        console.log('  - Dropped 5 old tables');
        console.log('  - Created 6 new tables');
        console.log('  - Seeded dynamic_lists with sample data');
        console.log('  - All foreign keys configured');
        console.log('  - Indexes created for performance\n');

    } catch (error) {
        console.error('❌ Migration Error:', error.message);
        console.error(error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

rebuildPropertiesSchema();
