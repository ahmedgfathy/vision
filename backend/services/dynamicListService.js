const pool = require('../config/db');
const auditLogService = require('./auditLogService');

class DynamicListService {
    /**
     * Get all values for a specific category
     */
    async getByCategory(category) {
        const [rows] = await pool.query(
            'SELECT * FROM dynamic_lists WHERE category = ? AND active = true ORDER BY display_order ASC, value ASC',
            [category]
        );
        return rows;
    }

    /**
     * Get all categories
     */
    async getAllCategories() {
        const [rows] = await pool.query(
            'SELECT DISTINCT category FROM dynamic_lists ORDER BY category'
        );
        return rows.map(row => row.category);
    }

    /**
     * Get all items (admin use)
     */
    async findAll(filters = {}) {
        let query = 'SELECT * FROM dynamic_lists WHERE 1=1';
        const params = [];

        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }

        if (filters.active !== undefined) {
            query += ' AND active = ?';
            params.push(filters.active);
        }

        query += ' ORDER BY category, display_order ASC, value ASC';

        const [rows] = await pool.query(query, params);
        return rows;
    }

    /**
     * Get single item by ID
     */
    async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM dynamic_lists WHERE id = ?',
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Create new dropdown value
     */
    async create(data, userId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO dynamic_lists (category, value, active, display_order) VALUES (?, ?, ?, ?)',
                [data.category, data.value, data.active !== false, data.display_order || 0]
            );

            const itemId = result.insertId;

            // Audit log
            await auditLogService.log(userId, 'dynamic_lists', itemId, 'CREATE', null, data);

            await connection.commit();
            return this.findById(itemId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Update dropdown value
     */
    async update(id, data, userId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const oldItem = await this.findById(id);
            if (!oldItem) {
                throw new Error('Item not found');
            }

            await connection.query(
                'UPDATE dynamic_lists SET category = ?, value = ?, active = ?, display_order = ? WHERE id = ?',
                [data.category, data.value, data.active !== false, data.display_order || 0, id]
            );

            // Audit log
            await auditLogService.log(userId, 'dynamic_lists', id, 'UPDATE', oldItem, data);

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
     * Delete dropdown value
     */
    async delete(id, userId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const item = await this.findById(id);
            if (!item) {
                throw new Error('Item not found');
            }

            // Check if used in properties
            const usageCount = await this.getUsageCount(id);
            if (usageCount > 0) {
                throw new Error(`Cannot delete. This value is used in ${usageCount} properties.`);
            }

            await connection.query('DELETE FROM dynamic_lists WHERE id = ?', [id]);

            // Audit log
            await auditLogService.log(userId, 'dynamic_lists', id, 'DELETE', item, null);

            await connection.commit();
            return { message: 'Item deleted successfully' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Check usage count in properties
     */
    async getUsageCount(id) {
        const [result] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM properties WHERE area_id = ?) +
        (SELECT COUNT(*) FROM properties WHERE mall_id = ?) +
        (SELECT COUNT(*) FROM properties WHERE community_id = ?) +
        (SELECT COUNT(*) FROM properties WHERE type_id = ?) +
        (SELECT COUNT(*) FROM more_info WHERE phase_id = ?) as count
    `, [id, id, id, id, id]);

        return result[0].count;
    }

    /**
     * Toggle active status
     */
    async toggleActive(id, userId) {
        const item = await this.findById(id);
        if (!item) {
            throw new Error('Item not found');
        }
        return this.update(id, { ...item, active: !item.active }, userId);
    }
}

module.exports = new DynamicListService();
