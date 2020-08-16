import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';
import socketio from 'socket.io';
import http from 'http';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import rateLimiter from './middlewares/rateLimiter';
import socketMiddleware from './middlewares/socketMiddleware';

import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

io.on('connection', socket => {
  console.log('a user connected :D');

  socket.on('disconnect', () => {
    console.log('a user disconnected D:');
  });
});

app.use(socketMiddleware);

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor.',
  });
});

server.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});

export { io };
