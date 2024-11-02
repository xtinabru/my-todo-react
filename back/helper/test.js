import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeTestDb = () => {
  const sql = fs.readFileSync(path.resolve(__dirname, '../db_setup.sql'), 'utf8');
  pool.query(sql, (error) => {
    if (error) {
      console.error('Error executing SQL script:', error);
    } else {
      console.log('Database initialized successfully');
    }
  });
};

export { initializeTestDb };
