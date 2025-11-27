import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/domain';
import { ErrorResponse } from '../types/api';
import { config } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (config.nodeEnv === 'development') {
    console.error('Error:', err);
  } else {
    console.error('Error:', err.message);
  }

  if (err instanceof ApiError) {
    const response: ErrorResponse = {
      error: {
        message: err.message,
        code: err.code,
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  const response: ErrorResponse = {
    error: {
      message:
        config.nodeEnv === 'development'
          ? err.message
          : 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
    },
  };

  res.status(500).json(response);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  const response: ErrorResponse = {
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  };

  res.status(404).json(response);
};
