import express from 'express';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import pool from '../config/database';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-fallback-secret-key'
);

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function issueToken(user: { id: string | number; role: string }) {
  const jwt = await new SignJWT({ sub: String(user.id), role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
  
  return jwt;
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
    const token = await issueToken({ id: user.id, role: profileResult.rows[0]?.role || 'user' });

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

// Get current user (for token validation)
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Get user details from database
    const result = await pool.query(
      'SELECT au.id, au.email, u.id as profile_id, u.full_name, u.role, u.phone FROM auth_users au LEFT JOIN users u ON au.id = u.user_id WHERE au.id = $1',
      [payload.sub]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userData = result.rows[0];
    res.json({
      user: {
        id: userData.id,
        email: userData.email,
        profile: userData.profile_id ? {
          id: userData.profile_id,
          full_name: userData.full_name,
          role: userData.role,
          phone: userData.phone,
          email: userData.email
        } : null
      }
    });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
});

export default router;