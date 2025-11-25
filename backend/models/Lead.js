const db = require('../config/db');

class Lead {
  static async create(leadData) {
    const {
      name,
      email,
      mobile,
      source,
      status,
      notes,
      assigned_to,
      budget,
      property_type,
      location_preference,
      created_by
    } = leadData;

    const [result] = await db.execute(
      `INSERT INTO leads 
       (name, email, mobile, source, status, notes, assigned_to, budget, property_type, location_preference, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, mobile, source, status || 'new', notes, assigned_to, budget, property_type, location_preference, created_by]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT l.*, 
              u.username as assigned_to_name,
              c.username as created_by_name
       FROM leads l
       LEFT JOIN users u ON l.assigned_to = u.id
       LEFT JOIN users c ON l.created_by = c.id
       WHERE l.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT l.*, 
             u.username as assigned_to_name,
             c.username as created_by_name
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      LEFT JOIN users c ON l.created_by = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND l.status = ?';
      params.push(filters.status);
    }

    if (filters.source) {
      query += ' AND l.source = ?';
      params.push(filters.source);
    }

    if (filters.assigned_to) {
      query += ' AND l.assigned_to = ?';
      params.push(filters.assigned_to);
    }

    if (filters.search) {
      query += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.mobile LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY l.created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async update(id, leadData) {
    const {
      name,
      email,
      mobile,
      source,
      status,
      notes,
      assigned_to,
      budget,
      property_type,
      location_preference
    } = leadData;

    await db.execute(
      `UPDATE leads 
       SET name = ?, email = ?, mobile = ?, source = ?, status = ?, 
           notes = ?, assigned_to = ?, budget = ?, property_type = ?, 
           location_preference = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, email, mobile, source, status, notes, assigned_to, budget, property_type, location_preference, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM leads WHERE id = ?', [id]);
  }

  static async getStats() {
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_leads,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) as qualified,
        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
        SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) as lost
      FROM leads
    `);
    return stats[0];
  }
}

module.exports = Lead;
