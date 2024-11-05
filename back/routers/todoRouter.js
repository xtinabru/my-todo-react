import { pool } from '../helper/db.js'; 
import { Router } from "express";
import { emptyOrRows } from '../helper/utils.js'; 
import auth from '../helper/auth.js';

const router = Router();

// GET 
router.get('/', auth, (req, res) => {
  const userId = req.user.id;

  pool.query('SELECT * FROM task WHERE user_id = $1', [userId], (error, result) => {
    if (error) {
      console.error('Error', error);
      return res.status(500).json({ error: error.message });
    }
    const rows = emptyOrRows(result);
    return res.status(200).json(rows);
  });
});

// POST 
router.post('/create', auth, (req, res) => {
  if (!req.body.description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  const userId = req.user.id;
  pool.query('INSERT INTO task (description, user_id) VALUES ($1, $2) RETURNING *', [req.body.description, userId], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ id: result.rows[0].id, description: req.body.description });
  });
});

// DELETE 
router.delete('/delete/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user.id;

  pool.query('DELETE FROM task WHERE id = $1 AND user_id = $2', [id, userId], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ id });
  });
});

export default router;
