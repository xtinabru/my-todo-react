import { pool } from '../helper/db.js';
import { Router } from 'express';
import { hash, compare } from 'bcrypt';  
import jwt from 'jsonwebtoken'; 

const router = Router();

// POST /register
router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  hash(password, 10, (error, hashedPassword) => {
    if (error) return next(error); 

    try {
      pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword],
        (error, result) => {
          if (error) return next(error);
          return res.status(201).json({
            id: result.rows[0].id,
            email: result.rows[0].email,
          });
        }
      );
    } catch (error) {
      return next(error); 
    }
  });
});

// POST /login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body; 
  const invalid_message = 'Invalid credentials';
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    pool.query('SELECT * FROM account WHERE email=$1',
      [email],
      (error, result) => {
        if (error) return next(error);
        if (result.rowCount === 0) return next(new Error(invalid_message));

        compare(password, result.rows[0].password, (error, match) => {
          if (error) return next(error);
          if (!match) return next(new Error(invalid_message));

          const token = jwt.sign({ user: email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
          const user = result.rows[0];
          return res.status(200).json({
            'id': user.id,
            'email': user.email,
            'token': token
          });
        });
      }
    );
  } catch (error) {
    return next(error);
  }
});

export default router;
