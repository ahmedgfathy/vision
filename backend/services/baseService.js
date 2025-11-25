const pool = require('../config/db');

class BaseService {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async findAll() {
        const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return rows[0];
    }

    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');

        const [result] = await pool.query(
            `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
            values
        );
        return { id: result.insertId, ...data };
    }

    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        await pool.query(
            `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
        return this.findById(id);
    }

    async delete(id) {
        await pool.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        return { message: 'Deleted successfully' };
    }
}

module.exports = BaseService;
