import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const { method, path, ip } = req;

  if (config.logLevel === 'debug') {
    console.log(`[${new Date().toISOString()}] ${method} ${path} - IP: ${ip}`);
  }

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    let statusColor = '\x1b[32m';
    if (statusCode >= 400 && statusCode < 500) {
      statusColor = '\x1b[33m';
    } else if (statusCode >= 500) {
      statusColor = '\x1b[31m';
    }

    const resetColor = '\x1b[0m';

    console.log(
      `[${new Date().toISOString()}] ${method} ${path} ${statusColor}${statusCode}${resetColor} - ${duration}ms`
    );
  });

  next();
};
