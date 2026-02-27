import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const logger = new Logger('HTTP');

export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();
  const requestIdHeader = req.header('x-request-id');
  const requestId = requestIdHeader || randomUUID();

  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const user = req.user as { id?: string; sub?: string } | undefined;

    logger.log({
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      duration,
      userId: user?.id || user?.sub || null,
    });
  });

  next();
}
