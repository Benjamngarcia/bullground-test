import { Request, Response, NextFunction } from 'express';
import { supabase } from '../infrastructure/supabaseClient';
import { ApiError } from '../types/domain';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = signupSchema.parse(req.body);

      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        throw new ApiError(400, error.message, 'SIGNUP_ERROR');
      }

      if (!data.user) {
        throw new ApiError(400, 'Failed to create user', 'SIGNUP_ERROR');
      }

      res.status(201).json({
        user: {
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at,
        },
        session: data.session
          ? {
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token,
              expiresIn: data.session.expires_in,
              expiresAt: data.session.expires_at,
            }
          : null,
        message: data.session
          ? 'User registered successfully'
          : 'User registered. Please check your email for verification.',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, error.errors[0].message, 'VALIDATION_ERROR'));
        return;
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        throw new ApiError(401, error.message, 'LOGIN_ERROR');
      }

      if (!data.session) {
        throw new ApiError(401, 'Failed to create session', 'LOGIN_ERROR');
      }

      res.status(200).json({
        user: {
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at,
        },
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in,
          expiresAt: data.session.expires_at,
        },
        message: 'Login successful',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, error.errors[0].message, 'VALIDATION_ERROR'));
        return;
      }
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = refreshSchema.parse(req.body);

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: validatedData.refreshToken,
      });

      if (error) {
        throw new ApiError(401, error.message, 'REFRESH_ERROR');
      }

      if (!data.session) {
        throw new ApiError(401, 'Failed to refresh session', 'REFRESH_ERROR');
      }

      res.status(200).json({
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in,
          expiresAt: data.session.expires_at,
        },
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, error.errors[0].message, 'VALIDATION_ERROR'));
        return;
      }
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new ApiError(401, 'Authorization header missing', 'UNAUTHORIZED');
      }

      const token = authHeader.split(' ')[1];

      const { error } = await supabase.auth.admin.signOut(token);

      if (error) {
        throw new ApiError(400, error.message, 'LOGOUT_ERROR');
      }

      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        throw new ApiError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const { data, error } = await supabase.auth.admin.getUserById(userId);

      if (error) {
        throw new ApiError(404, error.message, 'USER_NOT_FOUND');
      }

      if (!data.user) {
        throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
      }

      res.status(200).json({
        user: {
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at,
          emailConfirmed: data.user.email_confirmed_at !== null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
