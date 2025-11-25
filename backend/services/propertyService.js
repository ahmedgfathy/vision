const pool = require('../config/db');
const auditLogService = require('./auditLogService');

class PropertyService {
  /**
   * Create property with all related data
   */
  async create(data, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert main property
      const [propertyResult] = await connection.query(`
        INSERT INTO properties (
          unit_for, area_id, unit_license, mall_id, community_id, type_id,
          finished, building, total_price, more_units, unit_no, description,
          latitude, longitude, created_by_user_id, updated_by_user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.unit_for, data.area_id, data.unit_license, data.mall_id, data.community_id,
        data.type_id, data.finished, data.building, data.total_price, data.more_units || false,
        data.unit_no, data.description, data.latitude, data.longitude, userId, userId
      ]);

      const propertyId = propertyResult.insertId;

      // Insert owner_info (required)
      if (data.owner_info) {
        await connection.query(`
          INSERT INTO owner_info (
            property_id, offered_by, update_state, owner_name, update_by,
            mobile, last_follow_in, tel, call_update, call_note, new_feedback
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          propertyId, data.owner_info.offered_by, data.owner_info.update_state || 'Want Update',
          data.owner_info.owner_name, data.owner_info.update_by, data.owner_info.mobile,
          data.owner_info.last_follow_in, data.owner_info.tel, data.owner_info.call_update,
          data.owner_info.call_note, data.owner_info.new_feedback
        ]);
      }

      // Insert update_info (optional)
      if (data.update_info) {
        await connection.query(`
          INSERT INTO update_info (
            property_id, reminder_time, rent_to, reminder_date, repeated_statement
          ) VALUES (?, ?, ?, ?, ?)
        `, [
          propertyId, data.update_info.reminder_time, data.update_info.rent_to,
          data.update_info.reminder_date, data.update_info.repeated_statement
        ]);
      }

      // Insert more_info (required)
      if (data.more_info) {
        await connection.query(`
          INSERT INTO more_info (
            property_id, property_name, handler_id, phase_id
          ) VALUES (?, ?, ?, ?)
        `, [
          propertyId, data.more_info.property_name,
          data.more_info.handler_id || userId, data.more_info.phase_id
        ]);
      }

      // Audit log
      await auditLogService.log(userId, 'properties', propertyId, 'CREATE', null, data);

      await connection.commit();
      return this.findById(propertyId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Find all properties with filters
   */
  async findAll(filters = {}) {
    let query = `
      SELECT 
        p.*,
        area.value as area_name,
        mall.value as mall_name,
        community.value as community_name,
        type.value as type_name,
        mi.property_name,
        oi.owner_name,
        oi.mobile as owner_mobile,
        creator.username as created_by_name
      FROM properties p
      LEFT JOIN dynamic_lists area ON p.area_id = area.id
      LEFT JOIN dynamic_lists mall ON p.mall_id = mall.id
      LEFT JOIN dynamic_lists community ON p.community_id = community.id
      LEFT JOIN dynamic_lists type ON p.type_id = type.id
      LEFT JOIN more_info mi ON p.id = mi.property_id
      LEFT JOIN owner_info oi ON p.id = oi.property_id
      LEFT JOIN users creator ON p.created_by_user_id = creator.id
      WHERE 1=1
    `;

    const params = [];

    if (filters.unit_for) {
      query += ' AND p.unit_for = ?';
      params.push(filters.unit_for);
    }

    if (filters.area_id) {
      query += ' AND p.area_id = ?';
      params.push(filters.area_id);
    }

    if (filters.type_id) {
      query += ' AND p.type_id = ?';
      params.push(filters.type_id);
    }

    if (filters.unit_license) {
      query += ' AND p.unit_license = ?';
      params.push(filters.unit_license);
    }

    if (filters.search) {
      query += ' AND (mi.property_name LIKE ? OR oi.owner_name LIKE ? OR p.building LIKE ? OR p.unit_no LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query, params);

    // Fetch gallery for each property
    for (const property of rows) {
      const [gallery] = await pool.query(
        'SELECT * FROM property_gallery WHERE property_id = ? ORDER BY is_primary DESC, display_order ASC',
        [property.id]
      );
      property.gallery = gallery;
    }

    return rows;
  }

  /**
   * Find single property by ID with all related data
   */
  async findById(id) {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        area.value as area_name,
        mall.value as mall_name,
        community.value as community_name,
        type.value as type_name,
        creator.username as created_by_name,
        updater.username as updated_by_name
      FROM properties p
      LEFT JOIN dynamic_lists area ON p.area_id = area.id
      LEFT JOIN dynamic_lists mall ON p.mall_id = mall.id
      LEFT JOIN dynamic_lists community ON p.community_id = community.id
      LEFT JOIN dynamic_lists type ON p.type_id = type.id
      LEFT JOIN users creator ON p.created_by_user_id = creator.id
      LEFT JOIN users updater ON p.updated_by_user_id = updater.id
      WHERE p.id = ?
    `, [id]);

    if (rows.length === 0) return null;

    const property = rows[0];

    // Get owner_info
    const [ownerInfo] = await pool.query(
      'SELECT * FROM owner_info WHERE property_id = ?',
      [id]
    );
    property.owner_info = ownerInfo[0] || null;

    // Get update_info
    const [updateInfo] = await pool.query(
      'SELECT * FROM update_info WHERE property_id = ?',
      [id]
    );
    property.update_info = updateInfo[0] || null;

    // Get more_info
    const [moreInfo] = await pool.query(`
      SELECT mi.*, phase.value as phase_name, handler.username as handler_name
      FROM more_info mi
      LEFT JOIN dynamic_lists phase ON mi.phase_id = phase.id
      LEFT JOIN users handler ON mi.handler_id = handler.id
      WHERE mi.property_id = ?
    `, [id]);
    property.more_info = moreInfo[0] || null;

    // Get gallery
    const [gallery] = await pool.query(
      'SELECT * FROM property_gallery WHERE property_id = ? ORDER BY is_primary DESC, display_order ASC',
      [id]
    );
    property.gallery = gallery;

    return property;
  }

  /**
   * Update property with all related data
   */
  async update(id, data, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const oldProperty = await this.findById(id);
      if (!oldProperty) {
        throw new Error('Property not found');
      }

      // Update main property
      await connection.query(`
        UPDATE properties SET
          unit_for = ?, area_id = ?, unit_license = ?, mall_id = ?, community_id = ?,
          type_id = ?, finished = ?, building = ?, total_price = ?, more_units = ?,
          unit_no = ?, description = ?, latitude = ?, longitude = ?, updated_by_user_id = ?
        WHERE id = ?
      `, [
        data.unit_for, data.area_id, data.unit_license, data.mall_id, data.community_id,
        data.type_id, data.finished, data.building, data.total_price, data.more_units,
        data.unit_no, data.description, data.latitude, data.longitude, userId, id
      ]);

      // Update or insert owner_info
      if (data.owner_info) {
        const exists = await connection.query('SELECT id FROM owner_info WHERE property_id = ?', [id]);

        if (exists[0].length > 0) {
          await connection.query(`
            UPDATE owner_info SET
              offered_by = ?, update_state = ?, owner_name = ?, update_by = ?,
              mobile = ?, last_follow_in = ?, tel = ?, call_update = ?, call_note = ?, new_feedback = ?
            WHERE property_id = ?
          `, [
            data.owner_info.offered_by, data.owner_info.update_state, data.owner_info.owner_name,
            data.owner_info.update_by, data.owner_info.mobile, data.owner_info.last_follow_in,
            data.owner_info.tel, data.owner_info.call_update, data.owner_info.call_note,
            data.owner_info.new_feedback, id
          ]);
        } else {
          await connection.query(`
            INSERT INTO owner_info (property_id, offered_by, update_state, owner_name, update_by, mobile, last_follow_in, tel, call_update, call_note, new_feedback)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            id, data.owner_info.offered_by, data.owner_info.update_state, data.owner_info.owner_name,
            data.owner_info.update_by, data.owner_info.mobile, data.owner_info.last_follow_in,
            data.owner_info.tel, data.owner_info.call_update, data.owner_info.call_note, data.owner_info.new_feedback
          ]);
        }
      }

      // Update or insert update_info
      if (data.update_info) {
        const exists = await connection.query('SELECT id FROM update_info WHERE property_id = ?', [id]);

        if (exists[0].length > 0) {
          await connection.query(`
            UPDATE update_info SET reminder_time = ?, rent_to = ?, reminder_date = ?, repeated_statement = ?
            WHERE property_id = ?
          `, [
            data.update_info.reminder_time, data.update_info.rent_to,
            data.update_info.reminder_date, data.update_info.repeated_statement, id
          ]);
        } else {
          await connection.query(`
            INSERT INTO update_info (property_id, reminder_time, rent_to, reminder_date, repeated_statement)
            VALUES (?, ?, ?, ?, ?)
          `, [
            id, data.update_info.reminder_time, data.update_info.rent_to,
            data.update_info.reminder_date, data.update_info.repeated_statement
          ]);
        }
      }

      // Update or insert more_info
      if (data.more_info) {
        const exists = await connection.query('SELECT id FROM more_info WHERE property_id = ?', [id]);

        if (exists[0].length > 0) {
          await connection.query(`
            UPDATE more_info SET property_name = ?, handler_id = ?, phase_id = ?
            WHERE property_id = ?
          `, [data.more_info.property_name, data.more_info.handler_id, data.more_info.phase_id, id]);
        } else {
          await connection.query(`
            INSERT INTO more_info (property_id, property_name, handler_id, phase_id)
            VALUES (?, ?, ?, ?)
          `, [id, data.more_info.property_name, data.more_info.handler_id, data.more_info.phase_id]);
        }
      }

      // Audit log
      await auditLogService.log(userId, 'properties', id, 'UPDATE', oldProperty, data);

      await connection.commit();
      return this.findById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete property (cascades to related tables)
   */
  async delete(id, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const property = await this.findById(id);
      if (!property) {
        throw new Error('Property not found');
      }

      await connection.query('DELETE FROM properties WHERE id = ?', [id]);

      // Audit log
      await auditLogService.log(userId, 'properties', id, 'DELETE', property, null);

      await connection.commit();
      return { message: 'Property deleted successfully' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Add images to gallery
   */
  async addGalleryImages(propertyId, files, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filename = file.filename || file.path.split('/').pop();
        const relativePath = `uploads/properties/${filename}`;
        const isPrimary = i === 0; // First image is primary by default

        await connection.query(`
          INSERT INTO property_gallery (property_id, file_path, file_type, is_primary, display_order)
          VALUES (?, ?, ?, ?, ?)
        `, [propertyId, relativePath, 'image', isPrimary, i]);
      }

      await connection.commit();
      return this.findById(propertyId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete gallery image
   */
  async deleteGalleryImage(imageId, userId) {
    await pool.query('DELETE FROM property_gallery WHERE id = ?', [imageId]);
    return { message: 'Image deleted successfully' };
  }

  /**
   * Set primary image
   */
  async setPrimaryImage(propertyId, imageId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Remove primary from all images
      await connection.query(
        'UPDATE property_gallery SET is_primary = false WHERE property_id = ?',
        [propertyId]
      );

      // Set new primary
      await connection.query(
        'UPDATE property_gallery SET is_primary = true WHERE id = ? AND property_id = ?',
        [imageId, propertyId]
      );

      await connection.commit();
      return { message: 'Primary image updated' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new PropertyService();
