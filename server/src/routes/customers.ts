import express from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all customers
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, 
             json_agg(
               json_build_object(
                 'id', v.id,
                 'make', v.make,
                 'model', v.model,
                 'year', v.year,
                 'license_plate', v.license_plate,
                 'vin', v.vin,
                 'color', v.color
               )
             ) FILTER (WHERE v.id IS NOT NULL) as vehicles
      FROM customers c
      LEFT JOIN vehicles v ON c.id = v.customer_id
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create customer
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const result = await pool.query(
      'INSERT INTO customers (name, email, phone, address, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, address, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, notes } = req.body;

    const result = await pool.query(
      'UPDATE customers SET name = $1, email = $2, phone = $3, address = $4, notes = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [name, email, phone, address, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;