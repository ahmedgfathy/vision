const db = require('../config/db');
const auditLogService = require('./auditLogService');

class LeadService {
  async create(data, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO leads (name, email, phone, status, source, company_id, assigned_to, notes, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.name, data.email, data.phone, data.status || 'new', data.source, data.company_id, data.assigned_to, data.notes, userId]
      );

      const lead = await this.findById(result.insertId);

      // Log to audit
      await auditLogService.logAction(
        userId,
        'leads',
        result.insertId,
        'create',
        null,
        lead
      );

      await connection.commit();
      return lead;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findAll(filters = {}) {
    let query = `
      SELECT l.*, 
             u1.name as assigned_to_name,
             u2.name as created_by_name,
             c.name as company_name
      FROM leads l
      LEFT JOIN users u1 ON l.assigned_to = u1.id
      LEFT JOIN users u2 ON l.created_by = u2.id
      LEFT JOIN companies c ON l.company_id = c.id
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

    if (filters.company_id) {
      query += ' AND l.company_id = ?';
      params.push(filters.company_id);
    }

    if (filters.search) {
      query += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.phone LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY l.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  async findById(id) {
    const [rows] = await db.query(
      `SELECT l.*, 
              u1.name as assigned_to_name,
              u2.name as created_by_name,
              c.name as company_name
       FROM leads l
       LEFT JOIN users u1 ON l.assigned_to = u1.id
       LEFT JOIN users u2 ON l.created_by = u2.id
       LEFT JOIN companies c ON l.company_id = c.id
       WHERE l.id = ?`,
      [id]
    );
    return rows[0];
  }

  async update(id, data, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const oldData = await this.findById(id);
      if (!oldData) {
        throw new Error('Lead not found');
      }

      const updates = [];
      const params = [];

      if (data.name !== undefined) { updates.push('name = ?'); params.push(data.name); }
      if (data.email !== undefined) { updates.push('email = ?'); params.push(data.email); }
      if (data.phone !== undefined) { updates.push('phone = ?'); params.push(data.phone); }
      if (data.status !== undefined) { updates.push('status = ?'); params.push(data.status); }
      if (data.source !== undefined) { updates.push('source = ?'); params.push(data.source); }
      if (data.company_id !== undefined) { updates.push('company_id = ?'); params.push(data.company_id); }
      if (data.assigned_to !== undefined) { updates.push('assigned_to = ?'); params.push(data.assigned_to); }
      if (data.notes !== undefined) { updates.push('notes = ?'); params.push(data.notes); }

      if (updates.length > 0) {
        params.push(id);
        await connection.query(
          `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
          params
        );
      }

      const newData = await this.findById(id);

      // Log to audit
      await auditLogService.logAction(
        userId,
        'leads',
        id,
        'update',
        oldData,
        newData
      );

      await connection.commit();
      return newData;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(id, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const lead = await this.findById(id);
      if (!lead) {
        throw new Error('Lead not found');
      }

      await connection.query('DELETE FROM leads WHERE id = ?', [id]);

      // Log to audit
      await auditLogService.logAction(
        userId,
        'leads',
        id,
        'delete',
        lead,
        null
      );

      await connection.commit();
      return { message: 'Lead deleted successfully' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getStats() {
    const [stats] = await db.query(`
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

module.exports = new LeadService();
