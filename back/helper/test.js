// В вашем файле test.js
import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { fileURLToPath } from 'url';
import { hash } from 'bcrypt'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeTestDb = async () => {
  console.log('Clearing account table...');  // Добавляем лог
  const deleteResult = await pool.query('DELETE FROM account'); // Предполагается, что здесь вы очищаете таблицу
  console.log(`Deleted rows: ${deleteResult.rowCount}`);  // Логируем, сколько строк удалено

  // Здесь идет код, который инициализирует базу данных
  const sql = fs.readFileSync(path.resolve(__dirname, '../db_setup.sql'), 'utf8');
  await pool.query(sql);
  console.log('Database initialized successfully'); // Убедитесь, что эта строка тоже есть
};



const insertTestUser = async (email, password) => {
  const hashedPassword = await hash(password, 10);
  const result = await pool.query(
    'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );
  console.log(`Test user inserted successfully: ${result.rows[0].email}`);
};

export { initializeTestDb, insertTestUser };
