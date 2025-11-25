const db = require('../config/db');

class Profile {
  static async create(profileData) {
    const { name, description, is_active = true } = profileData;
    const [result] = await db.execute(
      'INSERT INTO profiles (name, description, is_active) VALUES (?, ?, ?)',
      [name, description, is_active]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM profiles WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM profiles ORDER BY name'
    );
    return rows;
  }

  static async update(id, profileData) {
    const { name, description, is_active } = profileData;
    await db.execute(
      'UPDATE profiles SET name = ?, description = ?, is_active = ? WHERE id = ?',
      [name, description, is_active, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM profiles WHERE id = ?', [id]);
  }

  static async getWithPermissions(id) {
    const profile = await this.findById(id);
    if (!profile) return null;

    const [modulePerms] = await db.execute(
      'SELECT * FROM profile_modules WHERE profile_id = ?',
      [id]
    );

    const [fieldPerms] = await db.execute(
      'SELECT * FROM profile_fields WHERE profile_id = ?',
      [id]
    );

    return {
      ...profile,
      modules: modulePerms,
      fields: fieldPerms
    };
  }
}

class ProfileModule {
  static async upsert(profileId, moduleName, permissions) {
    const { permission_view, permission_create, permission_edit, permission_delete } = permissions;
    
    await db.execute(
      `INSERT INTO profile_modules 
       (profile_id, module_name, permission_view, permission_create, permission_edit, permission_delete)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       permission_view = VALUES(permission_view),
       permission_create = VALUES(permission_create),
       permission_edit = VALUES(permission_edit),
       permission_delete = VALUES(permission_delete)`,
      [profileId, moduleName, permission_view, permission_create, permission_edit, permission_delete]
    );
  }

  static async getByProfile(profileId) {
    const [rows] = await db.execute(
      'SELECT * FROM profile_modules WHERE profile_id = ?',
      [profileId]
    );
    return rows;
  }

  static async getByProfileAndModule(profileId, moduleName) {
    const [rows] = await db.execute(
      'SELECT * FROM profile_modules WHERE profile_id = ? AND module_name = ?',
      [profileId, moduleName]
    );
    return rows[0];
  }

  static async deleteByProfile(profileId) {
    await db.execute('DELETE FROM profile_modules WHERE profile_id = ?', [profileId]);
  }

  static async deleteByProfileAndModule(profileId, moduleName) {
    await db.execute(
      'DELETE FROM profile_modules WHERE profile_id = ? AND module_name = ?',
      [profileId, moduleName]
    );
  }
}

class ProfileField {
  static async upsert(profileId, moduleName, fieldName, permissions) {
    const { can_view, can_edit } = permissions;
    
    await db.execute(
      `INSERT INTO profile_fields 
       (profile_id, module_name, field_name, can_view, can_edit)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       can_view = VALUES(can_view),
       can_edit = VALUES(can_edit)`,
      [profileId, moduleName, fieldName, can_view, can_edit]
    );
  }

  static async getByProfile(profileId) {
    const [rows] = await db.execute(
      'SELECT * FROM profile_fields WHERE profile_id = ?',
      [profileId]
    );
    return rows;
  }

  static async getByProfileAndModule(profileId, moduleName) {
    const [rows] = await db.execute(
      'SELECT * FROM profile_fields WHERE profile_id = ? AND module_name = ?',
      [profileId, moduleName]
    );
    return rows;
  }

  static async deleteByProfile(profileId) {
    await db.execute('DELETE FROM profile_fields WHERE profile_id = ?', [profileId]);
  }

  static async deleteByProfileAndModule(profileId, moduleName) {
    await db.execute(
      'DELETE FROM profile_fields WHERE profile_id = ? AND module_name = ?',
      [profileId, moduleName]
    );
  }
}

module.exports = {
  Profile,
  ProfileModule,
  ProfileField
};
