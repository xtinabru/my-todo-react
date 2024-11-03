import { pool } from '../helper/db.js'; 
import { Router } from 'express'; 
import { hash, compare } from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv'; 

dotenv.config(); 

const router = Router();

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
  return result.rows[0]; 
};

// POST /register
router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {

    const existingUser = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await hash(password, 10);

  
    console.log(`Inserting user: ${email}, Password (hashed): ${hashedPassword}`); 
    const result = await pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]);

    return res.status(201).json({
      id: result.rows[0].id,
      email: result.rows[0].email,
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    return next(error);
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    console.warn('Password does not match for email:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({
    id: user.id,
    email: user.email,
    token: token
  });
});

export default router; 
