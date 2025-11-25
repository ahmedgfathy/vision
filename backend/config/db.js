const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    if (error.code === 'ER_BAD_DB_ERROR') {
        console.log('Database does not exist. Attempting to create...');
        const tempPool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        });
        const tempConnection = await tempPool.getConnection();
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        tempConnection.release();
        console.log(`Database ${process.env.DB_NAME} created.`);
    } else {
        console.error('Database connection failed:', error);
    }
  }
})();

module.exports = pool;
