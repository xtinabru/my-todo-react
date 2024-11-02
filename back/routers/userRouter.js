import { pool } from '../helper/db.js';
import { Router } from 'express';
import { hash } from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 

const router = Router();

// POST /register
router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;
  // Проверяем наличие email и password
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  // Хеширование пароля
  hash(password, 10, (error, hashedPassword) => {
    if (error) return next(error); // Ошибка хеширования

    try {
      // Исправленный SQL-запрос
      pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword],
        (error, result) => {
          if (error) return next(error); // Ошибка базы данных

          // Возвращаем id и email нового пользователя
          return res.status(201).json({
            id: result.rows[0].id,
            email: result.rows[0].email,
          });
        }
      );
    } catch (error) {
      return next(error); // Ошибка обработки
    }
  });
});

export default router;
