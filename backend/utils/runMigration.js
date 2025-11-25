const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'vision_crm',
    multipleStatements: true
  });

  try {
    console.log('🔄 Running RBAC migration...');
    
    const migrationPath = path.join(__dirname, '../migrations/001_create_rbac_tables.sql');
    const sql = await fs.readFile(migrationPath, 'utf8');
    
    await connection.query(sql);
    
    console.log('✅ RBAC tables created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration();
