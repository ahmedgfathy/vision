const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedProfiles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'vision_crm'
  });

  try {
    console.log('🌱 Seeding RBAC profiles...');

    // 1. Create Admin Profile (Full Access)
    const [adminResult] = await connection.execute(
      'INSERT INTO profiles (name, description, is_active) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
      ['Admin', 'Full system access with all permissions', true]
    );
    const adminProfileId = adminResult.insertId;

    // Admin module permissions (full access to all)
    const modules = [
      'properties', 'owner_info', 'update_info', 'more_info', 'gallery',
      'leads', 'agents', 'companies', 'tasks', 'dropdown_management',
      'users', 'profiles', 'permissions', 'audit_logs', 'dashboard'
    ];

    for (const module of modules) {
      await connection.execute(
        `INSERT INTO profile_modules (profile_id, module_name, permission_view, permission_create, permission_edit, permission_delete)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE permission_view=VALUES(permission_view), permission_create=VALUES(permission_create), 
         permission_edit=VALUES(permission_edit), permission_delete=VALUES(permission_delete)`,
        [adminProfileId, module, true, true, true, true]
      );
    }

    // 2. Create Sales Profile (View properties only)
    const [salesResult] = await connection.execute(
      'INSERT INTO profiles (name, description, is_active) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
      ['Sales', 'Can view properties and leads, no edit permissions', true]
    );
    const salesProfileId = salesResult.insertId;

    // Sales module permissions
    await connection.execute(
      `INSERT INTO profile_modules (profile_id, module_name, permission_view, permission_create, permission_edit, permission_delete)
       VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE permission_view=VALUES(permission_view)`,
      [salesProfileId, 'properties', true, false, false, false,
       salesProfileId, 'leads', true, false, false, false,
       salesProfileId, 'dashboard', true, false, false, false]
    );

    // Sales field permissions (view only for properties)
    const propertyFields = [
      'unit_for', 'area_id', 'type_id', 'finished', 'building', 'bedrooms', 'bathrooms',
      'parking_spaces', 'total_price', 'unit_no', 'description'
    ];

    for (const field of propertyFields) {
      await connection.execute(
        `INSERT INTO profile_fields (profile_id, module_name, field_name, can_view, can_edit)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE can_view=VALUES(can_view), can_edit=VALUES(can_edit)`,
        [salesProfileId, 'properties', field, true, false]
      );
    }

    // 3. Create Agent Profile (View + edit assigned properties)
    const [agentResult] = await connection.execute(
      'INSERT INTO profiles (name, description, is_active) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
      ['Agent', 'Can view and edit properties, manage leads and tasks', true]
    );
    const agentProfileId = agentResult.insertId;

    // Agent module permissions
    await connection.execute(
      `INSERT INTO profile_modules (profile_id, module_name, permission_view, permission_create, permission_edit, permission_delete)
       VALUES 
       (?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       permission_view=VALUES(permission_view), 
       permission_create=VALUES(permission_create),
       permission_edit=VALUES(permission_edit),
       permission_delete=VALUES(permission_delete)`,
      [
        agentProfileId, 'properties', true, true, true, false,
        agentProfileId, 'owner_info', true, false, true, false,
        agentProfileId, 'update_info', true, false, true, false,
        agentProfileId, 'leads', true, true, true, false,
        agentProfileId, 'tasks', true, true, true, false
      ]
    );

    // Agent field permissions (can edit most property fields)
    const agentPropertyFields = [
      { field: 'unit_for', view: true, edit: true },
      { field: 'area_id', view: true, edit: true },
      { field: 'type_id', view: true, edit: true },
      { field: 'finished', view: true, edit: true },
      { field: 'building', view: true, edit: true },
      { field: 'bedrooms', view: true, edit: true },
      { field: 'bathrooms', view: true, edit: true },
      { field: 'parking_spaces', view: true, edit: true },
      { field: 'total_price', view: true, edit: false }, // View only
      { field: 'unit_no', view: true, edit: true },
      { field: 'description', view: true, edit: true },
      { field: 'furnished', view: true, edit: true },
      { field: 'has_pool', view: true, edit: true },
      { field: 'has_gym', view: true, edit: true },
      { field: 'has_security', view: true, edit: true },
      { field: 'has_garden', view: true, edit: true },
      { field: 'has_balcony', view: true, edit: true },
      { field: 'has_elevator', view: true, edit: true }
    ];

    for (const { field, view, edit } of agentPropertyFields) {
      await connection.execute(
        `INSERT INTO profile_fields (profile_id, module_name, field_name, can_view, can_edit)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE can_view=VALUES(can_view), can_edit=VALUES(can_edit)`,
        [agentProfileId, 'properties', field, view, edit]
      );
    }

    // Owner info fields for agent (can edit feedback, call notes)
    const ownerInfoFields = [
      { field: 'offered_by', view: true, edit: false },
      { field: 'owner_name', view: true, edit: false },
      { field: 'mobile', view: false, edit: false }, // Hidden
      { field: 'tel', view: true, edit: false },
      { field: 'call_update', view: true, edit: true },
      { field: 'new_feedback', view: true, edit: true },
      { field: 'call_note', view: true, edit: true }
    ];

    for (const { field, view, edit } of ownerInfoFields) {
      await connection.execute(
        `INSERT INTO profile_fields (profile_id, module_name, field_name, can_view, can_edit)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE can_view=VALUES(can_view), can_edit=VALUES(can_edit)`,
        [agentProfileId, 'owner_info', field, view, edit]
      );
    }

    console.log('✅ Seed data created successfully!');
    console.log(`   - Admin Profile ID: ${adminProfileId}`);
    console.log(`   - Sales Profile ID: ${salesProfileId}`);
    console.log(`   - Agent Profile ID: ${agentProfileId}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

seedProfiles();
