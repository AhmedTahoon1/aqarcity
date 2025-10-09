import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

const getJwtRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }
  return secret;
};

export const generateTokens = (user: { id: string; email: string; role: string }) => {
  const jwtSecret = getJwtSecret();
  const jwtRefreshSecret = getJwtRefreshSecret();
  const accessExpiresIn: string = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as string;
  const refreshExpiresIn: string = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string;
  
  const accessToken = jwt.sign(user, jwtSecret, { 
    expiresIn: accessExpiresIn
  });
  
  const refreshToken = jwt.sign({ id: user.id }, jwtRefreshSecret, { 
    expiresIn: refreshExpiresIn
  });
  
  return { accessToken, refreshToken };
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'ACCESS_TOKEN_REQUIRED',
      message: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'TOKEN_EXPIRED',
        message: 'Access token expired' 
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'INVALID_SIGNATURE',
        message: 'Invalid token signature' 
      });
    }
    return res.status(403).json({ 
      error: 'INVALID_TOKEN',
      message: 'Invalid token' 
    });
  }
};

export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      error: 'REFRESH_TOKEN_REQUIRED',
      message: 'Refresh token required' 
    });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, getJwtRefreshSecret()) as any;
    req.body.userId = decoded.id;
    next();
  } catch (err: any) {
    return res.status(403).json({ 
      error: 'INVALID_REFRESH_TOKEN',
      message: 'Invalid refresh token' 
    });
  }
};

export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'INSUFFICIENT_PERMISSIONS',
        message: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user?.role || null
      });
    }
    next();
  };
};

// Legacy support
export const generateToken = (user: { id: string; email: string; role: string }) => {
  return generateTokens(user).accessToken;
};