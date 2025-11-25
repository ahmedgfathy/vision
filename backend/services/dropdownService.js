const pool = require('../config/db');
const auditLogService = require('./auditLogService');

// Whitelist of allowed tables
const ALLOWED_TABLES = ['property_types', 'property_status', 'listing_types'];

// Map tables to their usage in properties table
const TABLE_USAGE_MAP = {
    'property_types': 'type_id',
    'property_status': 'status_id',
    'listing_types': 'listing_type_id'
};

class DropdownService {
    /**
     * Validate table name against whitelist
     */
    validateTable(tableName) {
        if (!ALLOWED_TABLES.includes(tableName)) {
            throw new Error(`Invalid table name: ${tableName}`);
        }
    }

    /**
     * Get usage count for a dropdown value
     */
    async getUsageCount(tableName, id) {
        this.validateTable(tableName);
        const columnName = TABLE_USAGE_MAP[tableName];

        if (!columnName) {
            return 0;
        }

        try {
            const [rows] = await pool.query(
                `SELECT COUNT(*) as count FROM properties WHERE ${columnName} = ?`,
                [id]
            );
            return rows[0].count;
        } catch (error) {
            // Column doesn't exist in properties table, return 0
            console.warn(`Column ${columnName} not found in properties table:`, error.message);
            return 0;
        }
    }

    /**
     * Get all items from a dropdown table
     */
    async findAll(tableName) {
        this.validateTable(tableName);

        const [rows] = await pool.query(`
      SELECT dt.*, 
             creator.username as created_by_name,
             updater.username as updated_by_name
      FROM ${tableName} dt
      LEFT JOIN users creator ON dt.created_by_user_id = creator.id
      LEFT JOIN users updater ON dt.updated_by_user_id = updater.id
      ORDER BY dt.id ASC
    `);

        // Add usage count to each item
        for (const row of rows) {
            row.usage_count = await this.getUsageCount(tableName, row.id);
        }

        return rows;
    }

    /**
     * Get single item by ID
     */
    async findById(tableName, id) {
        this.validateTable(tableName);

        const [rows] = await pool.query(`
      SELECT dt.*,
             creator.username as created_by_name,
             updater.username as updated_by_name
      FROM ${tableName} dt
      LEFT JOIN users creator ON dt.created_by_user_id = creator.id
      LEFT JOIN users updater ON dt.updated_by_user_id = updater.id
      WHERE dt.id = ?
    `, [id]);

        if (rows.length === 0) return null;

        const item = rows[0];
        item.usage_count = await this.getUsageCount(tableName, item.id);

        return item;
    }

    /**
     * Create new dropdown item
     */
    async create(tableName, data, userId) {
        this.validateTable(tableName);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO ${tableName} (name, active, created_by_user_id, updated_by_user_id) 
         VALUES (?, ?, ?, ?)`,
                [data.name, data.active !== false, userId, userId]
            );

            const itemId = result.insertId;

            // Audit log
            await auditLogService.log(userId, tableName, itemId, 'CREATE', null, data);

            await connection.commit();
            return this.findById(tableName, itemId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Update dropdown item
     */
    async update(tableName, id, data, userId) {
        this.validateTable(tableName);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Get old values for audit
            const oldItem = await this.findById(tableName, id);
            if (!oldItem) {
                throw new Error('Item not found');
            }

            await connection.query(
                `UPDATE ${tableName} 
         SET name = ?, active = ?, updated_by_user_id = ? 
         WHERE id = ?`,
                [data.name, data.active !== false, userId, id]
            );

            // Audit log
            await auditLogService.log(userId, tableName, id, 'UPDATE', oldItem, data);

            await connection.commit();
            return this.findById(tableName, id);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Delete dropdown item (with usage protection)
     */
    async delete(tableName, id, userId) {
        this.validateTable(tableName);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Get item for audit
            const item = await this.findById(tableName, id);
            if (!item) {
                throw new Error('Item not found');
            }

            // Check usage count
            const usageCount = await this.getUsageCount(tableName, id);
            if (usageCount > 0) {
                throw new Error(`Cannot delete. This item is currently used in ${usageCount} properties.`);
            }

            await connection.query(
                `DELETE FROM ${tableName} WHERE id = ?`,
                [id]
            );

            // Audit log
            await auditLogService.log(userId, tableName, id, 'DELETE', item, null);

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
     * Toggle active status
     */
    async toggleActive(tableName, id, userId) {
        this.validateTable(tableName);

        const item = await this.findById(tableName, id);
        if (!item) {
            throw new Error('Item not found');
        }

        return this.update(tableName, id, { name: item.name, active: !item.active }, userId);
    }

    /**
     * Get allowed tables list
     */
    getAllowedTables() {
        return ALLOWED_TABLES.map(table => ({
            id: table,
            name: table.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }));
    }
}

module.exports = new DropdownService();
