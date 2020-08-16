import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';
import { io } from '../server';

export default function socketMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  try {
    request.io = io;

    next();
  } catch (err) {
    throw new AppError('Houve algum erro no socketMiddleware');
  }
}
