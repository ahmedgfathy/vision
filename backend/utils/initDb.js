const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initDb = async () => {
    let connection;
    try {
        // Connect without database selected to create it
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        });

        console.log(`Creating database ${process.env.DB_NAME} if not exists...`);
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        await tempConnection.end();

        // Now connect to the database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Initializing database tables...');

        // Create Roles Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255)
      )
    `);

        // Create Users Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `);

        // Create Permissions Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        resource VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        description VARCHAR(255)
      )
    `);

        // Create Role Permissions Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INT,
        permission_id INT,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      )
    `);

        console.log('Tables created successfully.');

        // Seed Roles
        const roles = [
            { name: 'admin', description: 'Administrator with full access' },
            { name: 'manager', description: 'Manager with access to most resources' },
            { name: 'agent', description: 'Agent with limited access' }
        ];

        for (const role of roles) {
            await connection.query(`
        INSERT IGNORE INTO roles (name, description) VALUES (?, ?)
      `, [role.name, role.description]);
        }

        // Seed Admin User
        const adminPassword = await bcrypt.hash('admin123', 10);
        const [adminRole] = await connection.query('SELECT id FROM roles WHERE name = ?', ['admin']);

        if (adminRole.length > 0) {
            // Check if admin exists
            const [existingAdmin] = await connection.query('SELECT id FROM users WHERE username = ?', ['admin']);
            if (existingAdmin.length === 0) {
                await connection.query(`
          INSERT INTO users (username, email, password_hash, role_id) 
          VALUES (?, ?, ?, ?)
        `, ['admin', 'admin@vision.com', adminPassword, adminRole[0].id]);
                console.log('Admin user created.');
            } else {
                console.log('Admin user already exists.');
            }
        }

        console.log('Database seeded successfully.');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

initDb();
