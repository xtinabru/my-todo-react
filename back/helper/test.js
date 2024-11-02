import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { fileURLToPath } from 'url';
import { hash } from 'bcrypt'; 

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

const insertTestUser = (email, password) => {
  hash(password, 10, (error, hashedPassword) => {
    if (error) {
      console.error('Error hashing password:', error);
      return;
    }
    pool.query(
      'INSERT INTO account (email, password) VALUES ($1, $2)',
      [email, hashedPassword],
      (error) => {
        if (error) {
          console.error('Error inserting test user:', error);
        } else {
          console.log('Test user inserted successfully');
        }
      }
    );
  });
};

export { initializeTestDb, insertTestUser };
