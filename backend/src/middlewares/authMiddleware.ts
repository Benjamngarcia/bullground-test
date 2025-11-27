import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { ApiError } from '../types/domain';

interface JwtPayload {
  sub: string;
  email?: string;
  [key: string]: unknown;
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, 'Authorization header missing', 'UNAUTHORIZED');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError(401, 'Invalid authorization header format', 'UNAUTHORIZED');
    }

    const token = parts[1];

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    if (!decoded.sub) {
      throw new ApiError(401, 'Invalid token: missing user ID', 'UNAUTHORIZED');
    }

    req.userId = decoded.sub;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid token', 'UNAUTHORIZED'));
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, 'Token expired', 'TOKEN_EXPIRED'));
      return;
    }

    next(new ApiError(500, 'Authentication error', 'AUTH_ERROR'));
  }
};

export const devAuthBypass = (req: Request, _res: Response, next: NextFunction): void => {
  if (config.nodeEnv === 'development' && req.headers['x-test-user-id']) {
    req.userId = req.headers['x-test-user-id'] as string;
    next();
    return;
  }

  authMiddleware(req, _res, next);
};
