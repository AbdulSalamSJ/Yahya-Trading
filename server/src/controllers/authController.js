import bcrypt from 'bcryptjs';
import { db } from '../db/connection.js';
import { generateToken } from '../middleware/auth.js';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await db.createUser({
      name,
      email,
      passwordHash,
      role: 'customer'
    });

    const token = generateToken(user);
    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await db.findUserByEmail(cleanEmail);
    if (!user) {
      // Check admin aliases
      if (cleanEmail === 'admin@yahyatraders.com') {
        user = await db.findUserByEmail('admin@chocolatier.com');
      } else if (cleanEmail === 'admin@chocolatier.com') {
        user = await db.findUserByEmail('admin@yahyatraders.com');
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
}
