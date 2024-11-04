import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { fileURLToPath } from 'url';
import { hash } from 'bcrypt'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализация базы данных для тестов
const initializeTestDb = async () => {
  console.log('Clearing account and task tables...');  
  await pool.query('DELETE FROM task'); // Очистить задачи
  const deleteResult = await pool.query('DELETE FROM account'); 
  console.log(`Deleted rows from account: ${deleteResult.rowCount}`);  

  // Инициализация базы данных
  const sql = fs.readFileSync(path.resolve(__dirname, '../db_setup.sql'), 'utf8');
  await pool.query(sql);
  console.log('Database initialized successfully'); 

  // Добавляем тестового пользователя
  const user = await insertTestUser('testuser@example.com', 'password123');
  console.log(`Test user ID: ${user.id}`); // Логируем user.id

  if (!user || !user.id) {
    throw new Error('User creation failed or returned user ID is null');
  }

  // Добавляем тестовую задачу для этого пользователя
  await createTask('Sample task', user.id);
  console.log('Sample task created successfully'); // Логируем успешное создание задачи
};

// Функция для добавления тестового пользователя
const insertTestUser = async (email, password) => {
  const hashedPassword = await hash(password, 10);
  console.log(`Inserting user: ${email}`); // Логируем перед вставкой
  const result = await pool.query(
      'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
  );
  
  // Добавляем логирование для проверки результата
  if (result.rows.length === 0) {
    throw new Error('User insertion failed: no rows returned.');
  }

  console.log(`Test user inserted successfully: ${result.rows[0].email}`); 
  return result.rows[0]; // Возвращаем созданного пользователя
};

// Функция для добавления задачи
const createTask = async (description, userId) => {
  console.log(`Creating task with userId: ${userId}`); // Логируем userId
  if (!userId) {
    throw new Error('userId is null or undefined when creating task');
  }

  const result = await pool.query(
      'INSERT INTO task (description, userid) VALUES ($1, $2) RETURNING *',
      [description, userId]
  );

  // Добавляем логирование для проверки результата
  if (result.rows.length === 0) {
    throw new Error('Task insertion failed: no rows returned.');
  }

  console.log(`Task inserted successfully: ${result.rows[0].description}`);
};


export { initializeTestDb, insertTestUser };
