const pool = require('../config/db');

/**
 * Middleware to check if user has required permission
 * @param {string} permission - Required permission (e.g., 'properties.create')
 */
const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;

            // Admin has all permissions
            if (userRole === 'admin') {
                return next();
            }

            // Get user's role ID
            const [roleRows] = await pool.query(
                'SELECT id FROM roles WHERE name = ?',
                [userRole]
            );

            if (roleRows.length === 0) {
                return res.status(403).json({ message: 'Access denied: Invalid role' });
            }

            const roleId = roleRows[0].id;

            // Check if role has the required permission
            const [permissionRows] = await pool.query(
                `SELECT rp.* 
         FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id = ? AND p.name = ?`,
                [roleId, permission]
            );

            if (permissionRows.length === 0) {
                return res.status(403).json({
                    message: 'Access denied: You do not have permission to perform this action',
                    required_permission: permission
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ message: 'Error checking permissions' });
        }
    };
};

module.exports = { checkPermission };
