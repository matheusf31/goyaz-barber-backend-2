import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import BanController from '../controllers/BanController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);

const usersController = new UsersController();
const banController = new BanController();
const userAvatarController = new UserAvatarController();

usersRouter.get('/', ensureAuthenticated, usersController.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .required()
        .pattern(/^(\d\d)(\d{4,5}-?\d{4})$/),
      password: Joi.string().required(),
      provider: Joi.boolean(),
      admin: Joi.boolean(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/ban',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.string().uuid().required(),
      banned: Joi.boolean().required(),
    },
  }),
  ensureAuthenticated,
  banController.update,
);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
