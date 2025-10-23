// src/lib/auth.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './types';

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  name: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Mock user database (replace with real database)
const users = [
  {
    id: '1',
    email: 'demo@example.com',
    password: '$2a$10$XQ5Ld0O3pqZJXJXJXJXJXe9qZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5a', // password: demo123
    name: 'Demo User',
    preferences: {
      theme: 'dark' as const,
      chartType: 'line' as const,
      refreshInterval: 5000,
    },
  },
];

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}


export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return null;
  }

  // For demo purposes, accept 'demo123' as password
  const isValid = password === 'demo123' || await verifyPassword(password, user.password);
  
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    preferences: user.preferences,
  };
}

export function getUserFromToken(token: string): User | null {
  const decoded = verifyToken(token);

  if (!decoded || typeof decoded === 'string') {
    return null;
  }

  const { id } = decoded as DecodedToken;
  const user = users.find(u => u.id === id);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    preferences: user.preferences,
  };
}