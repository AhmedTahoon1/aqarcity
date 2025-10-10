import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken, AuthRequest, generateTokens, refreshTokenMiddleware } from '../middleware/auth';

const router = express.Router();

// Input validation helper
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password && password.length >= 6;
};

const validatePhone = (phone: string) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?971[0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const normalizePhone = (phone: string) => {
  if (!phone) return null;
  
  // Remove all spaces and special characters
  let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Add +971 if not present
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '+971' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('971')) {
    cleanPhone = '+' + cleanPhone;
  } else if (!cleanPhone.startsWith('+971')) {
    cleanPhone = '+971' + cleanPhone;
  }
  
  return cleanPhone;
};

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('⚙️ Registration attempt:', { email: req.body.email, name: req.body.name });
    const { email, name, phone, password, role = 'buyer' } = req.body;

    // Comprehensive validation
    if (!email || !name || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'MISSING_FIELDS',
        message: 'Email, name, and password are required',
        details: {
          email: !email ? 'Email is required' : null,
          name: !name ? 'Name is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    if (!validateEmail(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ 
        error: 'INVALID_EMAIL',
        message: 'Please provide a valid email address' 
      });
    }

    if (!validatePassword(password)) {
      console.log('❌ Invalid password');
      return res.status(400).json({ 
        error: 'INVALID_PASSWORD',
        message: 'Password must be at least 6 characters long' 
      });
    }

    if (phone && !validatePhone(phone)) {
      console.log('❌ Invalid phone format:', phone);
      return res.status(400).json({ 
        error: 'INVALID_PHONE',
        message: 'Please provide a valid UAE phone number' 
      });
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password (reduced from 12 to 10 rounds for better performance)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`✅ Password hashed for user: ${email}`);

    // Normalize phone number
    const normalizedPhone = normalizePhone(phone);
    console.log(`📱 Phone normalized: ${phone} -> ${normalizedPhone}`);
    
    // Create user
    const newUser = await db.insert(users).values({
      email,
      name,
      phone: normalizedPhone,
      role,
      password: hashedPassword
    }).returning();

    // Generate tokens
    const tokens = generateTokens({
      id: newUser[0].id,
      email: newUser[0].email,
      role: newUser[0].role
    });

    res.status(201).json({
      message: 'User created successfully',
      ...tokens,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
        role: newUser[0].role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user[0].password || '');
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokens = generateTokens({
      id: user[0].id,
      email: user[0].email,
      role: user[0].role
    });

    res.json({
      message: 'Login successful',
      ...tokens,
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
    
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role,
        phone: user[0].phone,
        avatar: user[0].avatar
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('🔄 Updating profile for user:', req.user!.email);
    const { name, phone, avatar } = req.body;
    
    // Validate input
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ 
        error: 'INVALID_NAME',
        message: 'Name must be at least 2 characters long' 
      });
    }

    // Normalize and validate phone
    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone && !validatePhone(normalizedPhone)) {
      return res.status(400).json({ 
        error: 'INVALID_PHONE',
        message: 'Please provide a valid UAE phone number' 
      });
    }
    
    console.log(`📱 Phone normalized: ${phone} -> ${normalizedPhone}`);
    
    const updatedUser = await db.update(users)
      .set({ 
        name: name.trim(), 
        phone: normalizedPhone,
        avatar: avatar || null,
        updatedAt: new Date()
      })
      .where(eq(users.id, req.user!.id))
      .returning();

    console.log('✅ Profile updated successfully for:', req.user!.email);
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        name: updatedUser[0].name,
        phone: updatedUser[0].phone,
        avatar: updatedUser[0].avatar,
        role: updatedUser[0].role
      }
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ 
      error: 'PROFILE_UPDATE_FAILED',
      message: 'Failed to update profile' 
    });
  }
});

// Refresh token
router.post('/refresh', refreshTokenMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tokens = generateTokens({
      id: user[0].id,
      email: user[0].email,
      role: user[0].role
    });

    res.json({
      message: 'Tokens refreshed successfully',
      ...tokens
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;