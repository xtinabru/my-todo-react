import { pool } from '../helper/db.js'; ; 
import { Router } from "express";
import { emptyOrRows } from '../helper/utils.js'; 

const router = Router();

// GET
router.get('/', (req, res) => {
  pool.query('SELECT * FROM task', (error, result) => {
    if (error) {
      console.error('Error', error);
      return res.status(500).json({ error: error.message });
    }
    const rows = emptyOrRows(result); // use emptyOrRows
    return res.status(200).json(rows);
  });
});

// POST
router.post('/create', (req, res) => {
  if (!req.body.description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [req.body.description], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ id: result.rows[0].id });
  });
});

// DELETE
router.delete('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('DELETE FROM task WHERE id = $1', [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ id });
  });
});

export default router;
