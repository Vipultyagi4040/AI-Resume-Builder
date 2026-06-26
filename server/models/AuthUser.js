const { getPool } = require('../config/db');

const serializeUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    provider: row.provider,
    avatarUrl: row.avatar_url,
  };
};

exports.create = async ({ name, email, passwordHash, provider = 'local', avatarUrl = '' }) => {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO auth_users (name, email, password_hash, provider, avatar_url) VALUES (?, ?, ?, ?, ?)',
    [name, email, passwordHash, provider, avatarUrl]
  );
  const [rows] = await pool.query('SELECT * FROM auth_users WHERE id = ?', [result.insertId]);
  return serializeUser(rows[0]);
};

exports.findByEmail = async (email) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM auth_users WHERE email = ?', [email]);
  return serializeUser(rows[0]);
};

exports.findRawByEmail = async (email) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM auth_users WHERE email = ?', [email]);
  return rows[0] || null;
};

exports.update = async (id, fields) => {
  const pool = getPool();
  const setClauses = [];
  const values = [];
  for (const [key, value] of Object.entries(fields)) {
    setClauses.push(`${key} = ?`);
    values.push(value);
  }
  values.push(id);
  await pool.query(`UPDATE auth_users SET ${setClauses.join(', ')} WHERE id = ?`, values);
  const [rows] = await pool.query('SELECT * FROM auth_users WHERE id = ?', [id]);
  return serializeUser(rows[0]);
};

exports.updateResetCode = async (email, code, expiry) => {
  const pool = getPool();
  await pool.query(
    'UPDATE auth_users SET reset_code = ?, reset_code_expiry = ? WHERE email = ?',
    [code, expiry, email]
  );
};

exports.clearResetCode = async (id) => {
  const pool = getPool();
  await pool.query(
    'UPDATE auth_users SET reset_code = NULL, reset_code_expiry = NULL WHERE id = ?',
    [id]
  );
};

exports.findById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM auth_users WHERE id = ?', [id]);
  return serializeUser(rows[0]);
};
