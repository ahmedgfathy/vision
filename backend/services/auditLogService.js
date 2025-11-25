const pool = require('../config/db');

class AuditLogService {
    /**
     * Log a CRUD operation
     * @param {number} userId - The ID of the user performing the action
     * @param {string} tableName - The name of the table being modified
     * @param {number} recordId - The ID of the record being modified
     * @param {string} action - CREATE, UPDATE, or DELETE
     * @param {object} oldValues - Previous values (null for CREATE)
     * @param {object} newValues - New values (null for DELETE)
     */
    async log(userId, tableName, recordId, action, oldValues = null, newValues = null) {
        try {
            await pool.query(
                `INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values, new_values) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    tableName,
                    recordId,
                    action,
                    oldValues ? JSON.stringify(oldValues) : null,
                    newValues ? JSON.stringify(newValues) : null
                ]
            );
        } catch (error) {
            console.error('Audit log error:', error);
            // Don't throw - we don't want audit failures to break the app
        }
    }

    async getLogsForRecord(tableName, recordId) {
        const [rows] = await pool.query(
            `SELECT al.*, u.username 
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.table_name = ? AND al.record_id = ?
       ORDER BY al.created_at DESC`,
            [tableName, recordId]
        );
        return rows;
    }

    async getLogsForTable(tableName, limit = 100) {
        const [rows] = await pool.query(
            `SELECT al.*, u.username 
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.table_name = ?
       ORDER BY al.created_at DESC
       LIMIT ?`,
            [tableName, limit]
        );
        return rows;
    }
}

module.exports = new AuditLogService();
