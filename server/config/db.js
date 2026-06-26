const mysql = require('mysql2/promise');

let pool;

const createPool = () => {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_resume_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

const ensureDatabase = async (connection) => {
  const dbName = process.env.DB_NAME || 'ai_resume_db';
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
};

const initializeTables = async () => {
  const dbName = process.env.DB_NAME || 'ai_resume_db';
  await pool.query(`USE \`${dbName}\``);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS auth_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) DEFAULT NULL,
      provider ENUM('local', 'google') NOT NULL DEFAULT 'local',
      avatar_url VARCHAR(500) NOT NULL DEFAULT '',
      reset_code VARCHAR(10) DEFAULT NULL,
      reset_code_expiry DATETIME DEFAULT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_provider (provider)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL,
      job_description TEXT DEFAULT NULL,
      full_name VARCHAR(255) DEFAULT NULL,
      email VARCHAR(255) DEFAULT NULL,
      phone VARCHAR(50) DEFAULT NULL,
      location VARCHAR(255) DEFAULT NULL,
      summary TEXT DEFAULT NULL,
      skill1 VARCHAR(100) DEFAULT NULL,
      skill2 VARCHAR(100) DEFAULT NULL,
      skill3 VARCHAR(100) DEFAULT NULL,
      skill4 VARCHAR(100) DEFAULT NULL,
      skill5 VARCHAR(100) DEFAULT NULL,
      skill6 VARCHAR(100) DEFAULT NULL,
      skill7 VARCHAR(100) DEFAULT NULL,
      skill8 VARCHAR(100) DEFAULT NULL,
      skill9 VARCHAR(100) DEFAULT NULL,
      skill10 VARCHAR(100) DEFAULT NULL,
      company1 VARCHAR(255) DEFAULT NULL,
      position1 VARCHAR(255) DEFAULT NULL,
      duration1 VARCHAR(100) DEFAULT NULL,
      company2 VARCHAR(255) DEFAULT NULL,
      position2 VARCHAR(255) DEFAULT NULL,
      duration2 VARCHAR(100) DEFAULT NULL,
      degree1 VARCHAR(255) DEFAULT NULL,
      university1 VARCHAR(255) DEFAULT NULL,
      graduation_year1 VARCHAR(10) DEFAULT NULL,
      project1 TEXT DEFAULT NULL,
      project2 TEXT DEFAULT NULL,
      cover_letter TEXT DEFAULT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_email (user_email),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

const connectDB = async () => {
  try {
    createPool();

    const connection = await pool.getConnection();
    await connection.ping();

    await ensureDatabase(connection);
    await initializeTables();

    connection.release();
    console.log('MySQL Connected successfully');
  } catch (error) {
    console.error(`MySQL Connection Error: ${error.message}`);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool is not initialized. Call connectDB() first.');
  }
  return pool;
};

module.exports = {
  connectDB,
  getPool,
};
