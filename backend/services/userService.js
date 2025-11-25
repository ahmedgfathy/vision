const pool = require('../config/db');

class UserService {
    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    async getUserRole(userId) {
        const [rows] = await pool.query(`
      SELECT r.name, r.id 
      FROM roles r
      JOIN users u ON u.role_id = r.id
      WHERE u.id = ?
    `, [userId]);
        return rows[0];
    }
}

module.exports = new UserService();
