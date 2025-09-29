import express from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import pool from '../config/database';

const JWT_SECRET: Secret = (() => {
  const v = process.env.JWT_SECRET;
  if (!v) throw new Error("JWT_SECRET missing");
  return v;
})();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

export function issueToken(user: { id: string | number; role: string }) {
  const payload = { sub: String(user.id), role: user.role };
  const options: SignOptions = { algorithm: "HS256", expiresIn: JWT_EXPIRES_IN as string };
  return jwt.sign(payload, JWT_SECRET, options);
}

const router = express.Router();

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user from database
    const result = await pool.query(
      'SELECT * FROM auth_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user profile
    const profileResult = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = issueToken({ id: user.id, role: profileResult.rows[0]?.role || 'user' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        profile: profileResult.rows[0] || null
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign Up (Admin only - for creating new users)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM auth_users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create auth user
      await client.query(
        'INSERT INTO auth_users (id, email, password_hash) VALUES ($1, $2, $3)',
        [userId, email, passwordHash]
      );

      // Create user profile
      await client.query(
        'INSERT INTO users (user_id, email, full_name, role) VALUES ($1, $2, $3, $4)',
        [userId, email, fullName, role]
      );

      await client.query('COMMIT');

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;