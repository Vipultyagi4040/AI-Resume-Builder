const { getPool } = require('../config/db');

const columns = [
  'user_email', 'job_description', 'full_name', 'email', 'phone', 'location', 'summary',
  'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'skill6', 'skill7', 'skill8', 'skill9', 'skill10',
  'company1', 'position1', 'duration1', 'company2', 'position2', 'duration2',
  'degree1', 'university1', 'graduation_year1', 'project1', 'project2', 'cover_letter',
];

exports.create = async (resumeData) => {
  const pool = getPool();
  const values = columns.map(col => resumeData[col] || null);
  const placeholders = columns.map(() => '?').join(', ');
  const [result] = await pool.query(
    `INSERT INTO resumes (${columns.join(', ')}) VALUES (${placeholders})`,
    values
  );
  const [rows] = await pool.query('SELECT * FROM resumes WHERE id = ?', [result.insertId]);
  return rows[0];
};

exports.findByUserEmail = async (userEmail) => {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM resumes WHERE user_email = ? ORDER BY created_at DESC',
    [userEmail.toLowerCase().trim()]
  );
  return rows;
};

exports.findById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM resumes WHERE id = ?', [id]);
  return rows[0] || null;
};

exports.deleteById = async (id) => {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM resumes WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
